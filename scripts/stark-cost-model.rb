#!/usr/bin/env ruby
# Educational byte/work accounting; not a STARK implementation or security estimator.
# Standard library only. Regenerates docs/public/data/stark-cost/model.csv.
require 'csv'
require 'json'
require 'fileutils'

ROOT = File.expand_path('..', __dir__)
OUT = File.join(ROOT, 'docs/public/data/stark-cost')

def estimate(n: 2**16, q: 30, b: 8, w: 8, base_bytes: 8, extension_bytes: 16,
             digest_bytes: 32, terminal_size: 256, composition_columns: 1)
  { 'n' => n, 'b' => b, 'terminal_size' => terminal_size }.each do |name, value|
    unless value.is_a?(Integer) && value.positive? && (value & (value - 1)).zero?
      raise ArgumentError, "#{name} must be a positive power of two"
    end
  end
  [q, w, base_bytes, extension_bytes, digest_bytes, composition_columns].each do |value|
    raise ArgumentError, 'counts and byte widths must be positive integers' unless value.is_a?(Integer) && value.positive?
  end
  size = n * b
  raise ArgumentError, 'N must exceed terminal_size' unless size > terminal_size
  k = size.bit_length - 1
  rounds = k - (terminal_size.bit_length - 1)
  path_hashes = q * (3 * k + rounds * k - rounds * (rounds + 1) / 2)
  evaluation_bytes = q * (2 * w * base_bytes + composition_columns * extension_bytes + 2 * rounds * extension_bytes)
  authentication_bytes = path_hashes * digest_bytes
  terminal_bytes = terminal_size * extension_bytes
  root_bytes = (3 + rounds) * digest_bytes
  {
    'trace_length' => n, 'queries' => q, 'lde_size' => size, 'fri_rounds' => rounds,
    'evaluation_bytes' => evaluation_bytes, 'authentication_bytes' => authentication_bytes,
    'terminal_bytes' => terminal_bytes, 'root_bytes' => root_bytes,
    'total_bytes' => evaluation_bytes + authentication_bytes + terminal_bytes + root_bytes,
    'internal_hashes' => path_hashes, 'leaf_hashes' => q * (3 + rounds), 'fold_checks' => q * rounds
  }
end

def verify_model
  [1024, 65_536, 2**24].each do |n|
    [1, 30, 60].each do |q|
      e = estimate(n: n, q: q); size = n * 8
      bytes = (3 + e['fri_rounds']) * 32 + 256 * 16
      hashes = folds = leaves = 0
      q.times do
        [8 * 8, 8 * 8, 16].each do |width|
          bytes += width; leaves += 1
          nodes = size
          while nodes > 1
            bytes += 32; hashes += 1; nodes /= 2
          end
        end
        domain = size
        while domain > 256
          bytes += 2 * 16; folds += 1; leaves += 1
          nodes = domain / 2
          while nodes > 1
            bytes += 32; hashes += 1; nodes /= 2
          end
          domain /= 2
        end
      end
      raise 'serialization accounting mismatch' unless bytes == e['total_bytes']
      raise 'tree traversal accounting mismatch' unless [hashes, leaves, folds] == [e['internal_hashes'], e['leaf_hashes'], e['fold_checks']]
    end
  end
  e = estimate
  raise 'reference value mismatch' unless [e['total_bytes'], e['internal_hashes'], e['fold_checks']] == [211_424, 6_000, 330]
  [{ n: 1000 }, { q: 0 }, { n: 1 }, { b: 3 }].each do |args|
    rejected = false
    begin
      estimate(**args)
    rescue ArgumentError
      rejected = true
    end
    raise "invalid parameters were accepted: #{args.inspect}" unless rejected
  end
end

verify_model
FileUtils.mkdir_p(OUT)
rows = [20, 30, 40, 60].flat_map { |q| (10...25).step(2).map { |k| estimate(n: 2**k, q: q) } }
CSV.open(File.join(OUT, 'model.csv'), 'w', write_headers: true, headers: rows.first.keys, row_sep: "\n") do |csv|
  rows.each { |row| csv << row.values }
end
puts JSON.pretty_generate(estimate)
puts 'Independent tree traversal and byte counts verified; model.csv written.'
