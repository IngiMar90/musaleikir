# Músaleikir

Sjö músarleikir á íslensku fyrir nemendur sem eru að læra að nota tölvumús, frá fyrstu skrefum að meiri nákvæmni.

- Stjörnur: færa músina á stór skotmörk.
- Blöðrur: miða og smella.
- Dýravinir: halda inni, draga og sleppa.
- Turninn: stafla 5 eða 10 kubbum á turn með vaxandi nákvæmni.
- Formasmiðjan: velja úr 2–4 formum og draga rétta formið á útlínur.
- Slóðin: halda músartakkanum inni og fylgja braut með beygjum.
- Eldflugurnar: fylgja hreyfanlegu skotmarki og smella.

Engin innskráning, tímamörk, auglýsingar eða söfnun persónuupplýsinga. Stillingar eru aðeins vistaðar í vafranum.

## Keyra

Opnaðu `dist/index.html` í vafra eða þjónaðu `dist/` með einföldum vefþjóni. Engar uppsetningar eða ytri gagnatengingar þarf.

## Vefur

https://musaleikir.xalzir.chatgpt.site

## Aðgengi

Stór skotmörk, þrjú erfiðleikastig, stillanleg lotulengd, hljóð valfrjálst og sýnikennsla. Virkar með mús, snertifleti og snertiskjá. Hægt er að minnka hreyfingar með kerfisstillingu; þá er eldflugan kyrrstæð. Lyklaborð getur einnig stýrt hnöppum, valið mat og dýr og staðsett kubba og form með Enter/bilslá. Slóðin æfir sérstaklega samfellda músar- eða snertifærslu.

## Erfiðleikastig

| Leikur | Stig 1 | Stig 2 | Stig 3 |
| --- | --- | --- | --- |
| Turninn | Breiðir kubbar, rúmt vikmál | Minni kubbar, þrengra vikmál | Litlir kubbar, 9 px vikmál |
| Formasmiðjan | 2 form | 3 form | 4 form og meiri nákvæmni |
| Slóðin | Breið braut | Mjórri braut | Mjó braut og fleiri beygjur |
| Eldflugurnar | Stór og hæg | Minni og hraðari | Lítil og hraðari |

Rangri sleppingu fylgir enginn stigamissir. Kubbar og lokin verkefni haldast. Í Slóðinni byrjar aðeins núverandi slóð aftur ef farið er út af eða takkanum sleppt.

## Prófanir

`node --test tests/geometry.test.js`

Prófanir ná yfir nákvæmni við staðsetningu, alla leið eftir slóð, út af slóð og tilraunir til að stytta sér leið yfir beygjur með hröðum músarhreyfingum.

