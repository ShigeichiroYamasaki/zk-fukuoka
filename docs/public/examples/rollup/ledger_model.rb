# frozen_string_literal: true

# Executable accounting/Merkle model for the ZK Fukuoka rollup course.
# Ruby standard library only. No signatures, proof system, ERC-20 calls or
# network: calls represent already-authorized actions in a trusted test harness.
# SHA-256/JSON hashes are teaching encodings, NOT the course's Poseidon circuit ABI.
# Run: ruby ledger_model.rb --test  or  ruby ledger_model.rb

require 'digest'
require 'json'

TEST_MODE = ARGV == ['--test']
ARGV.clear if TEST_MODE
require 'minitest/autorun' if TEST_MODE

MAX = (2**64) - 1
OWNERS = %w[Alice Bob Carol Dave].freeze

def digest(tag, value)
  Digest::SHA256.hexdigest(JSON.generate([tag, value]))
end

def uint(value, positive: false)
  raise ArgumentError, 'invalid uint64' unless value.is_a?(Integer) && value >= (positive ? 1 : 0) && value <= MAX
end

class Ledger
  attr_reader :accounts, :deposits, :cursor, :exits, :vault, :receipts

  def initialize
    @accounts = OWNERS.each_with_index.map { |owner, id| { 'id' => id, 'owner' => owner, 'balance' => 0, 'nonce' => 0 } }
    @deposits = []
    @cursor = 0
    @exits = []
    @vault = 0
    @receipts = []
  end

  def account(index)
    raise ArgumentError, 'invalid account id' unless index.is_a?(Integer) && index.between?(0, @accounts.length - 1)

    @accounts[index]
  end

  def check
    unprocessed = @deposits[@cursor..].sum { |deposit| deposit['amount'] }
    balances = @accounts.sum { |account| account['balance'] }
    pending = @exits.reject { |exit| exit['claimed'] }.sum { |exit| exit['amount'] }
    raise ArgumentError, 'conservation failure' unless @vault == unprocessed + balances + pending

    @accounts.each do |item|
      uint(item['balance'])
      uint(item['nonce'])
    end
    { 'vault' => @vault, 'unprocessed' => unprocessed, 'balances' => balances, 'pending_withdrawals' => pending }
  end

  def receive(account_id, amount)
    account(account_id)
    uint(amount, positive: true)
    @deposits << { 'id' => @deposits.length, 'account' => account_id, 'amount' => amount }
    @vault += amount
  end

  def consume(deposit_id)
    unless deposit_id.is_a?(Integer) && deposit_id == @cursor && @cursor < @deposits.length
      raise ArgumentError, 'deposit order/replay'
    end

    deposit = @deposits[@cursor]
    target = account(deposit['account'])
    uint(target['balance'] + deposit['amount'])
    target['balance'] += deposit['amount']
    @cursor += 1
  end

  def transfer(sender, receiver, amount, nonce)
    # Authorization is deliberately outside this arithmetic model.
    source = account(sender)
    target = account(receiver)
    uint(amount, positive: true)
    uint(nonce)
    if sender == receiver || nonce != source['nonce'] || source['balance'] < amount
      raise ArgumentError, 'self-transfer, replay or insufficient balance'
    end

    uint(source['nonce'] + 1)
    uint(target['balance'] + amount)
    source['balance'] -= amount
    source['nonce'] += 1
    target['balance'] += amount
  end

  def withdraw(sender, recipient, amount, nonce)
    source = account(sender)
    uint(amount, positive: true)
    uint(nonce)
    unless OWNERS.include?(recipient) && nonce == source['nonce'] && source['balance'] >= amount
      raise ArgumentError, 'invalid withdrawal'
    end

    uint(source['nonce'] + 1)
    source['balance'] -= amount
    source['nonce'] += 1
    @exits << { 'id' => @exits.length, 'recipient' => recipient, 'amount' => amount, 'claimed' => false }
  end

  def claim(exit_id)
    unless exit_id.is_a?(Integer) && exit_id.between?(0, @exits.length - 1)
      raise ArgumentError, 'invalid exit id'
    end

    item = @exits[exit_id]
    raise ArgumentError, 'double claim' if item['claimed']

    item['claimed'] = true
    @vault -= item['amount']
  end

  def apply(operation, *args)
    unless %w[receive consume transfer withdraw claim].include?(operation)
      raise ArgumentError, 'unknown operation'
    end

    # Transactional wrapper: failure never commits a partial mutation.
    candidate = Marshal.load(Marshal.dump(self))
    candidate.public_send(operation, *args)
    candidate.check
    candidate.instance_variable_get(:@receipts) << [operation, args]
    %i[@accounts @deposits @cursor @exits @vault @receipts].each do |name|
      instance_variable_set(name, candidate.instance_variable_get(name))
    end
  end

  def leaves
    @accounts.map { |item| digest('account', item) }
  end

  def root
    leaf_hashes = leaves
    digest('node', [digest('node', leaf_hashes[0, 2]), digest('node', leaf_hashes[2, 2])])
  end

  def path(index)
    account(index)
    leaf_hashes = leaves
    [leaf_hashes[index ^ 1], index < 2 ? digest('node', leaf_hashes[2, 2]) : digest('node', leaf_hashes[0, 2])]
  end

  def self.verify(account, index, siblings, root)
    return false unless index.is_a?(Integer) && index.between?(0, 3) && siblings.length == 2 && account['id'] == index

    current = digest('account', account)
    siblings.each_with_index do |sibling, level|
      pair = ((index >> level) & 1) == 1 ? [sibling, current] : [current, sibling]
      current = digest('node', pair)
    end
    current == root
  end

  def self.replay(receipts)
    result = new
    receipts.each { |operation, args| result.apply(operation, *args) }
    result
  end
end

def demo
  ledger = Ledger.new
  ledger.apply('receive', 0, 100)
  ledger.apply('consume', 0)
  ledger.apply('transfer', 0, 1, 30, 0)
  ledger.apply('withdraw', 1, 'Bob', 30, 0)
  before_claim = ledger.check
  ledger.apply('claim', 0)
  [ledger, before_claim]
end

if TEST_MODE
class LedgerModelTest < Minitest::Test
  def funded
    ledger = Ledger.new
    ledger.apply('receive', 0, 100)
    ledger.apply('consume', 0)
    ledger
  end

  def reject_unchanged(ledger, operation, *args)
    snapshot = Marshal.dump(ledger)
    assert_raises(ArgumentError) { ledger.apply(operation, *args) }
    assert_equal snapshot, Marshal.dump(ledger)
  end

  def test_full_flow
    ledger, before = demo
    assert_equal({ 'vault' => 100, 'unprocessed' => 0, 'balances' => 70, 'pending_withdrawals' => 30 }, before)
    assert_equal({ 'vault' => 70, 'unprocessed' => 0, 'balances' => 70, 'pending_withdrawals' => 0 }, ledger.check)
    assert_equal [70, 0, 0, 0], ledger.accounts.map { |item| item['balance'] }
  end

  def test_deposit_queue
    ledger = Ledger.new
    ledger.apply('receive', 0, 10)
    ledger.apply('receive', 1, 20)
    assert_equal 30, ledger.check['unprocessed']
    reject_unchanged(ledger, 'consume', 1)
    ledger.apply('consume', 0)
    reject_unchanged(ledger, 'consume', 0)
  end

  def test_overspend
    reject_unchanged(funded, 'transfer', 0, 1, 101, 0)
  end

  def test_self_transfer
    reject_unchanged(funded, 'transfer', 0, 0, 1, 0)
  end

  def test_nonce_replay
    ledger = funded
    ledger.apply('transfer', 0, 1, 1, 0)
    reject_unchanged(ledger, 'transfer', 0, 1, 1, 0)
  end

  def test_invalid_range
    [-1, 0, MAX + 1, true].each { |amount| reject_unchanged(funded, 'transfer', 0, 1, amount, 0) }
  end

  def test_overflow
    ledger = Ledger.new
    ledger.apply('receive', 0, MAX)
    ledger.apply('consume', 0)
    ledger.apply('receive', 0, 1)
    reject_unchanged(ledger, 'consume', 1)
  end

  def test_exit_replay
    ledger, = demo
    reject_unchanged(ledger, 'claim', 0)
  end

  def test_withdrawal_nonce
    ledger = funded
    ledger.apply('withdraw', 0, 'Alice', 10, 0)
    reject_unchanged(ledger, 'withdraw', 0, 'Alice', 10, 0)
  end

  def test_merkle_membership
    ledger = funded
    ledger.accounts.each_with_index { |item, index| assert Ledger.verify(item, index, ledger.path(index), ledger.root) }
  end

  def test_merkle_tampering
    ledger = funded
    account = ledger.accounts[0].dup
    account['balance'] += 1
    refute Ledger.verify(account, 0, ledger.path(0), ledger.root)
    refute Ledger.verify(ledger.accounts[0], 1, ledger.path(0), ledger.root)
  end

  def test_replay_data
    ledger, = demo
    restored = Ledger.replay(ledger.receipts)
    assert_equal Marshal.dump(ledger), Marshal.dump(restored)
    missing = ledger.receipts[0, 2] + ledger.receipts[3..]
    assert_raises(ArgumentError) { Ledger.replay(missing) }
  end
end
end

if $PROGRAM_NAME == __FILE__
  if TEST_MODE
    # Minitest runs automatically after this file is loaded.
  else
    ledger, before = demo
    puts JSON.pretty_generate({ 'before_claim' => before, 'after_claim' => ledger.check,
                                'accounts' => ledger.accounts, 'account_root' => ledger.root,
                                'receipts' => ledger.receipts })
  end
end
