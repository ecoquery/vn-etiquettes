import { describe, expect, it } from 'vitest'
import { extractCreneau, extractPiscine, extractTitreCourt } from './inscritsSlice'

const sampleCreneaux = [
  'Centre Nautique Etienne Gagnaire Mercredi : 20h00 - 20h55',
  'Piscine André Boulloche Lundi : 12h30 - 13h25',
  'Piscine André Boulloche Vendredi : 20h00 - 20h55',
  'Piscine des Gratte Ciel Mardi : 19h15 - 20h00'
]
const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']
const sampleGroupes = [
  'ADU10 -3-4 nages',
  'ADU2 - 1/2 nages',
  'ADO - A1-2 - 14-17 ans - Maitrise 1-2 nages',
  'ADU3 - 3-4 nages',
  'Dauphin Bronze - DB5 - 7-8 ans',
  'Dauphin Argent - DA8',
  'ADU5 -3-4 nages',
  'ADU10 -3-4 nages',
  'Dauphin Bronze - DB5 - 7-8 ans',
  'Dauphin Or - DO3',
  'MAÎTRES',
  'Jeunes - J2-4 - 10-13 ans - Maitrise 3-4 nages',
  'ADULTES DEBUTANTS-Boulloche',
  'ADULTES DEBUTANTS-Gratte ciel'
]

describe('extractCreneau', () => {
  it('should start with a day', () => {
    const shortDays = days.map((s) => s.substring(0, 3))
    for (const cr of sampleCreneaux) {
      const creneau = extractCreneau(cr)
      expect(shortDays.some((day) => creneau.startsWith(day))).toBeTruthy()
    }
  })
  it('should contain a time', () => {
    for (const cr of sampleCreneaux) {
      const creneau = extractCreneau(cr)
      expect(creneau).toSatisfy((c) => Boolean(/.*\d+h\d\d.*/.exec(c)))
    }
  })
})

describe('extractPiscine', () => {
  it('should give a piscine name', () => {
    const piscineOk = ['CNEG', 'Boulloche', 'Piscine des Gratte Ciel']
    for (const cr of sampleCreneaux) {
      const piscine = extractPiscine(cr)
      expect(piscineOk).toContain(piscine)
    }
  })
})

describe('extractTitreCourt', () => {
  it('should parse a variety of groupes', () => {
    for (const gr of sampleGroupes) {
      expect(extractTitreCourt(gr)).not.toEqual('erreur')
    }
  })
  it('should extract the data from group', () => {
    expect(extractTitreCourt('ADU10 -3-4 nages')).toStrictEqual('ADU10')
  })
  it('should replace the data when needed', () => {
    expect(extractTitreCourt('ADULTES DEBUTANTS-Boulloche')).toStrictEqual('ADUDEB')
  })
})
