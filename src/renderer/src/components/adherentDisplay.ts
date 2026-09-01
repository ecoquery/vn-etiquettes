import { type Adherent, creneauAfficheable, nomSimple } from '../features/adherents/adherentsSlice'
import type { Alias } from '../features/configuration/configurationSlice'
import { type Activite, type Creneau, compareCreneaux } from '../features/creneaux/creneauxSlice'

export interface AdherentDisplay {
  id: string
  nom: string
  creneaux: string[]
  premierCreneau: string | undefined
  affiche: boolean
}

// FIXME: cas des activites sans carte
export const creneauDisplay = (aliasPiscines: Record<string, Alias>) => (c: Creneau) =>
  `${c.jour} ${c.debut} - ${aliasPiscines[c.lieu ?? '']?.replacement ?? c.lieu}`

export const buildAdherentDisplay =
  (
    cr: Record<string, Creneau>,
    act: Record<string, Activite>,
    aliasPiscines: Record<string, Alias>
  ) =>
  (adherent: Adherent) => {
    const id = adherent.nom
    const nom = nomSimple(adherent)
    const creneauxC = adherent.creneaux
      .map((n) => cr[n])
      .filter(creneauAfficheable(act, aliasPiscines))
      .toSorted(compareCreneaux)
    const premierCreneau = creneauxC[0]?.nom
    const affiche = creneauxC.length > 0
    const creneaux = creneauxC.map(creneauDisplay(aliasPiscines))
    return { id, nom, creneaux, premierCreneau, affiche } as AdherentDisplay
  }

export const compareAdherentDisplay = (a1: AdherentDisplay, a2: AdherentDisplay) =>
  a1.id.localeCompare(a2.id)
