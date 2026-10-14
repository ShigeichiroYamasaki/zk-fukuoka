# frozen_string_literal: true

# Run the distributed Ruby examples as a learner would, then check their
# observable results. This integration suite uses only Ruby's standard library.
require 'csv'
require 'json'
require 'minitest/autorun'
require 'open3'
require 'rbconfig'
require 'tmpdir'

ROOT = File.expand_path('../..', __dir__)

class RubyExamplesTest < Minitest::Test
  def run_example(relative_path, *arguments, chdir: ROOT, env: {})
    path = File.join(ROOT, relative_path)
    stdout, stderr, status = Open3.capture3(env, RbConfig.ruby, path, *arguments, chdir: chdir)
    assert status.success?, "#{relative_path} failed (#{status.exitstatus})\n#{stdout}\n#{stderr}"
    stdout
  end

  def test_balance_arithmetization_checks_all_encodings
    output = run_example('docs/public/examples/balance_arithmetization.rb', '--self-test')

    assert_includes output, '4096 inputs'
    assert_includes output, 'wraparound checks passed'
  end

  def test_fri_folding_checks_valid_and_invalid_degree_examples
    output = run_example('docs/public/examples/fri_folding.rb')

    assert_includes output, 'Invalid degree-4 input'
    assert_includes output, 'Challenges cancelling the tailored invalid addition: [3]'
    assert_includes output, 'All arithmetic checks passed'
    assert_includes output, 'No Merkle authentication or security claim'
  end

  def test_rollup_ledger_runs_its_invariant_and_negative_tests
    output = run_example('docs/public/examples/rollup/ledger_model.rb', '--test')

    assert_match(/\d+ runs, \d+ assertions, 0 failures, 0 errors/, output)
  end

  def test_zkml_training_writes_the_expected_model_in_a_temporary_directory
    Dir.mktmpdir('zk-fukuoka-ruby-test') do |directory|
      output = run_example('docs/public/examples/zkml/train.rb', chdir: directory)
      model = JSON.parse(File.read(File.join(directory, 'model.json')))

      assert_includes output, '256/256 training examples matched'
      assert_equal [19, 19], model.fetch('weights')
      assert_equal(-296, model.fetch('bias'))
      assert_equal 59, model.fetch('epochs')
    end
  end

  def test_stark_cost_model_reconciles_counts_and_writes_csv_outside_the_repository
    Dir.mktmpdir('zk-fukuoka-stark-test') do |directory|
      output = run_example('scripts/stark-cost-model.rb', env: { 'STARK_COST_OUTPUT_DIR' => directory })
      estimate_output = output.sub(/\nIndependent tree traversal.*\z/m, '')
      estimate = JSON.parse(estimate_output)
      rows = CSV.read(File.join(directory, 'model.csv'), headers: true)

      assert_equal 211_424, estimate.fetch('total_bytes')
      assert_equal 6_000, estimate.fetch('internal_hashes')
      assert_equal 330, estimate.fetch('fold_checks')
      assert_equal 32, rows.length
    end
  end
end
