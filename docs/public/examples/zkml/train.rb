# frozen_string_literal: true

# Integer perceptron on a synthetic, exhaustive 4-bit domain. Ruby standard library only.
require 'json'

def train
  # A perceptron predicts 1 when w0*a + w1*b + bias >= 0.
  # The training set is the complete synthetic 4-bit input domain, not sampled data.
  weights = [0, 0]
  bias = 0
  10_000.times do |epoch|
    errors = 0
    16.times do |a|
      16.times do |b|
        # The label is the threshold rule the circuit will later verify.
        target = (a + b >= 16) ? 1 : 0
        predicted = (weights[0] * a + weights[1] * b + bias >= 0) ? 1 : 0
        delta = target - predicted
        unless delta.zero?
          # The perceptron update moves the decision boundary toward the label.
          weights[0] += delta * a
          weights[1] += delta * b
          bias += delta
          errors += 1
        end
      end
    end
    return { 'weights' => weights, 'bias' => bias, 'epochs' => epoch + 1 } if errors.zero?
  end
  raise 'No convergence'
end

model = train
# The distributed circuit fixes these constants. A new model needs a new circuit/key.
expected = { 'weights' => [19, 19], 'bias' => -296, 'epochs' => 59 }
raise "unexpected model: #{model}" unless model == expected

# Exhaustive consistency check over every pair of 4-bit inputs. This verifies
# this small rule exactly; it is not a held-out machine-learning accuracy test.
256.times do |index|
  a, b = index.divmod(16)
  actual = (19 * a + 19 * b - 296 >= 0) ? 1 : 0
  expected_label = (a + b >= 16) ? 1 : 0
  raise "mismatch for (#{a}, #{b})" unless actual == expected_label
end

File.write('model.json', JSON.pretty_generate(model) + "\n")
puts "#{JSON.generate(model)} 256/256 training examples matched (not a held-out accuracy test)"
