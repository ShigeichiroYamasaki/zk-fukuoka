"""Executable accounting/Merkle model for the ZK Fukuoka rollup course.

Python 3.8+, standard library. No signatures, proof system, ERC-20 calls or
network: calls represent already-authorized actions in a trusted test harness.
SHA-256/JSON hashes are teaching encodings, NOT the course's Poseidon circuit ABI.
Run: python3 ledger_model.py --test  or  python3 ledger_model.py
"""
import argparse
import copy
import hashlib
import json
import unittest

MAX = 2**64 - 1
OWNERS = ('Alice', 'Bob', 'Carol', 'Dave')


def digest(tag, value):
    raw = json.dumps([tag, value], separators=(',', ':'), ensure_ascii=True).encode()
    return hashlib.sha256(raw).hexdigest()


def uint(value, positive=False):
    if type(value) is not int or not (int(positive) <= value <= MAX):
        raise ValueError('invalid uint64')


class Ledger:
    def __init__(self):
        self.accounts = [{'id': i, 'owner': o, 'balance': 0, 'nonce': 0}
                         for i, o in enumerate(OWNERS)]
        self.deposits = []
        self.cursor = 0
        self.exits = []
        self.vault = 0
        self.receipts = []

    def account(self, index):
        if type(index) is not int or not 0 <= index < len(self.accounts):
            raise ValueError('invalid account id')
        return self.accounts[index]

    def check(self):
        unprocessed = sum(d['amount'] for d in self.deposits[self.cursor:])
        balances = sum(a['balance'] for a in self.accounts)
        pending = sum(e['amount'] for e in self.exits if not e['claimed'])
        if self.vault != unprocessed + balances + pending:
            raise ValueError('conservation failure')
        for a in self.accounts:
            uint(a['balance']); uint(a['nonce'])
        return {'vault': self.vault, 'unprocessed': unprocessed,
                'balances': balances, 'pending_withdrawals': pending}

    def receive(self, account_id, amount):
        self.account(account_id); uint(amount, True)
        self.deposits.append({'id': len(self.deposits), 'account': account_id, 'amount': amount})
        self.vault += amount

    def consume(self, deposit_id):
        if type(deposit_id) is not int or deposit_id != self.cursor or self.cursor >= len(self.deposits):
            raise ValueError('deposit order/replay')
        d = self.deposits[self.cursor]; a = self.account(d['account'])
        uint(a['balance'] + d['amount'])
        a['balance'] += d['amount']; self.cursor += 1

    def transfer(self, sender, receiver, amount, nonce):
        # Authorization is deliberately outside this arithmetic model.
        a, b = self.account(sender), self.account(receiver)
        uint(amount, True); uint(nonce)
        if sender == receiver or nonce != a['nonce'] or a['balance'] < amount:
            raise ValueError('self-transfer, replay or insufficient balance')
        uint(a['nonce'] + 1); uint(b['balance'] + amount)
        a['balance'] -= amount; a['nonce'] += 1; b['balance'] += amount

    def withdraw(self, sender, recipient, amount, nonce):
        a = self.account(sender); uint(amount, True); uint(nonce)
        if recipient not in OWNERS or nonce != a['nonce'] or a['balance'] < amount:
            raise ValueError('invalid withdrawal')
        uint(a['nonce'] + 1)
        a['balance'] -= amount; a['nonce'] += 1
        self.exits.append({'id': len(self.exits), 'recipient': recipient,
                           'amount': amount, 'claimed': False})

    def claim(self, exit_id):
        if type(exit_id) is not int or not 0 <= exit_id < len(self.exits):
            raise ValueError('invalid exit id')
        e = self.exits[exit_id]
        if e['claimed']:
            raise ValueError('double claim')
        e['claimed'] = True; self.vault -= e['amount']

    def apply(self, operation, *args):
        # Transactional wrapper: failure never commits a partial mutation.
        if operation not in ('receive', 'consume', 'transfer', 'withdraw', 'claim'):
            raise ValueError('unknown operation')
        candidate = copy.deepcopy(self)
        getattr(candidate, operation)(*args)
        candidate.check()
        candidate.receipts.append([operation, list(args)])
        self.__dict__ = candidate.__dict__

    def leaves(self):
        return [digest('account', a) for a in self.accounts]

    def root(self):
        leaves = self.leaves()
        return digest('node', [digest('node', leaves[:2]), digest('node', leaves[2:])])

    def path(self, index):
        self.account(index); leaves = self.leaves()
        return [leaves[index ^ 1], digest('node', leaves[2:]) if index < 2 else digest('node', leaves[:2])]

    @staticmethod
    def verify(account, index, siblings, root):
        if type(index) is not int or not 0 <= index < 4 or len(siblings) != 2 or account['id'] != index:
            return False
        current = digest('account', account)
        for level, sibling in enumerate(siblings):
            pair = [sibling, current] if (index >> level) & 1 else [current, sibling]
            current = digest('node', pair)
        return current == root

    @classmethod
    def replay(cls, receipts):
        result = cls()
        for op, args in receipts:
            result.apply(op, *args)
        return result


def demo():
    ledger = Ledger()
    ledger.apply('receive', 0, 100)
    ledger.apply('consume', 0)
    ledger.apply('transfer', 0, 1, 30, 0)
    ledger.apply('withdraw', 1, 'Bob', 30, 0)
    before_claim = ledger.check()
    ledger.apply('claim', 0)
    return ledger, before_claim


class ModelTests(unittest.TestCase):
    def funded(self):
        l = Ledger(); l.apply('receive', 0, 100); l.apply('consume', 0); return l

    def reject_unchanged(self, l, op, *args):
        snapshot = copy.deepcopy(l.__dict__)
        with self.assertRaises(ValueError): l.apply(op, *args)
        self.assertEqual(snapshot, l.__dict__)

    def test_full_flow(self):
        l, before = demo()
        self.assertEqual(before, dict(vault=100, unprocessed=0, balances=70, pending_withdrawals=30))
        self.assertEqual(l.check(), dict(vault=70, unprocessed=0, balances=70, pending_withdrawals=0))
        self.assertEqual([a['balance'] for a in l.accounts], [70, 0, 0, 0])

    def test_deposit_queue(self):
        l = Ledger(); l.apply('receive', 0, 10); l.apply('receive', 1, 20)
        self.assertEqual(l.check()['unprocessed'], 30)
        self.reject_unchanged(l, 'consume', 1)
        l.apply('consume', 0); self.reject_unchanged(l, 'consume', 0)

    def test_overspend(self): self.reject_unchanged(self.funded(), 'transfer', 0, 1, 101, 0)
    def test_self_transfer(self): self.reject_unchanged(self.funded(), 'transfer', 0, 0, 1, 0)
    def test_nonce_replay(self):
        l = self.funded(); l.apply('transfer', 0, 1, 1, 0)
        self.reject_unchanged(l, 'transfer', 0, 1, 1, 0)
    def test_invalid_range(self):
        for amount in (-1, 0, MAX + 1, True): self.reject_unchanged(self.funded(), 'transfer', 0, 1, amount, 0)
    def test_overflow(self):
        l = Ledger(); l.apply('receive', 0, MAX); l.apply('consume', 0)
        l.apply('receive', 0, 1); self.reject_unchanged(l, 'consume', 1)
    def test_exit_replay(self):
        l, _ = demo(); self.reject_unchanged(l, 'claim', 0)
    def test_withdrawal_nonce(self):
        l = self.funded(); l.apply('withdraw', 0, 'Alice', 10, 0)
        self.reject_unchanged(l, 'withdraw', 0, 'Alice', 10, 0)
    def test_merkle_membership(self):
        l = self.funded()
        for i, a in enumerate(l.accounts): self.assertTrue(l.verify(a, i, l.path(i), l.root()))
    def test_merkle_tampering(self):
        l = self.funded(); a = dict(l.accounts[0]); a['balance'] += 1
        self.assertFalse(l.verify(a, 0, l.path(0), l.root()))
        self.assertFalse(l.verify(l.accounts[0], 1, l.path(0), l.root()))
    def test_replay_data(self):
        l, _ = demo(); restored = Ledger.replay(l.receipts)
        self.assertEqual(restored.__dict__, l.__dict__)
        missing = l.receipts[:2] + l.receipts[3:]
        with self.assertRaises(ValueError): Ledger.replay(missing)


if __name__ == '__main__':
    p = argparse.ArgumentParser(description=__doc__); p.add_argument('--test', action='store_true'); args = p.parse_args()
    if args.test:
        unittest.main(argv=['ledger_model.py'], exit=True)
    else:
        ledger, before = demo()
        print(json.dumps({'before_claim': before, 'after_claim': ledger.check(),
                          'accounts': ledger.accounts, 'account_root': ledger.root(),
                          'receipts': ledger.receipts}, indent=2))
