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
    text = '';
    for i in range(len(k)):
        text = '%s %s' % (text, k[i][0])
    text = '%s %f' % (text, kw[k])
    print(text)
