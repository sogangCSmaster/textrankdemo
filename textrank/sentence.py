from textrank import TextRank, RawSentenceReader
from konlpy.tag import Kkma
import sys

filename = sys.argv[1]
rate = float(sys.argv[2])

tr = TextRank()
#print('Load...')
from konlpy.tag import Komoran
tagger = Komoran()
stopword = set([('있', 'VV'), ('하', 'VV'), ('되', 'VV') ])
tr.loadSents(RawSentenceReader(filename), lambda sent: filter(lambda x:x not in stopword and x[1] in ('NNG', 'NNP', 'VV', 'VA'), tagger.pos(sent)))
#print('Build...')
tr.build()
ranks = tr.rank()
#for k in sorted(ranks, key=ranks.get, reverse=True)[:100]:
    #print("\t".join([str(k), str(ranks[k]), str(tr.dictCount[k])]))

sentence = '%s.' % (tr.summarize(rate).split('. ')[0])

kkma = Kkma()
print(sentence)
print(kkma.pos(sentence))

