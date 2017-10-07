from textrank import TextRank, RawTaggerReader
import sys

filename = sys.argv[1]
rate = float(sys.argv[2])

tr = TextRank(window=5, coef=1)
#print('Load...')
stopword = set([('있', 'VV'), ('하', 'VV'), ('되', 'VV'), ('없', 'VV') ])
tr.load(RawTaggerReader(filename), lambda w: w not in stopword and (w[1] in ('NNG', 'NNP', 'VV', 'VA')))
#print('Build...')
tr.build()
kw = tr.extract(rate)
for k in sorted(kw, key=kw.get, reverse=True):
    if len(k) == 1:
        print(k[0][0])
    else:
        print('%s %s' % (k[0][0], k[1][0]))
