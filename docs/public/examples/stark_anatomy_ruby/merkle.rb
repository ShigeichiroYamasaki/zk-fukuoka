# frozen_string_literal: true

require 'digest'

# A small binary Merkle tree with explicit domain separation. Leaves are field
# elements encoded as decimal strings; internal nodes hash two child digests.
module StarkAnatomyRuby
  module Merkle
    module_function

    def leaf(value) = Digest::SHA256.hexdigest("zk-fukuoka:leaf:v1:#{value}")
    def node(left, right) = Digest::SHA256.hexdigest("zk-fukuoka:node:v1:#{left}:#{right}")

    def levels(values)
      raise ArgumentError, 'Merkle tree requires a non-empty power-of-two table' if values.empty? || (values.length & (values.length - 1)) != 0

      layers = [values.map { |value| leaf(value) }]
      while layers.last.length > 1
        layers << layers.last.each_slice(2).map { |left, right| node(left, right) }
      end
      layers
    end

    def root(values) = levels(values).last.first

    def open(values, index)
      layers = levels(values)
      raise IndexError, 'leaf index outside tree' unless index.between?(0, values.length - 1)

      position = index
      layers[0...-1].map do |layer|
        sibling = position.even? ? position + 1 : position - 1
        position /= 2
        layer.fetch(sibling)
      end
    end

    def verify(root_hash, index, value, path)
      digest = leaf(value)
      position = index
      path.each do |sibling|
        digest = position.even? ? node(digest, sibling) : node(sibling, digest)
        position /= 2
      end
      digest == root_hash
    end
  end
end
