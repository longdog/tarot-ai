import { randomUUID } from "node:crypto";
import { Prompt } from "./model.js";
import { ITarologist } from "./model.js";


export async function testTarologist(): Promise<ITarologist> {
  

  return {
    explain: async (prompt: Array<Prompt>) => {
      await Bun.sleep(3000);
      return `# Data
${prompt.map(p=>p.content).join("\n")}

# Patulis pro

## Phoebeia marmora plaga

Lorem markdownum loca dominum; rapta, voce negabo pectoris patrium. Submovet
concipis humo corpora marmore. Sed *color orantem et* vetustas conorque regno:
et dixit intervenit ferro: *fata* caelatus rogantis color fodiebant, utraque.
Saxa me **odit**: marmor amens, et bucina et induitur fitque parte **domini
lacrimarum** iaculum; montibus. Grandine heres, nate, domus aratro magna.

1. Peti lacerti
2. Pectore sed
3. Hac color ante mihi
4. Nunc silva causas

## Membris iussit

Illa oscula, et devexo transit, nec cum penetralia **ferre ore** frondentis, 
et. Iovis concipit reponit
feruntur causam per passim Mnemonidas attollere ore merces somno *de videtur*
reddite, quae *unum ferarum*. Litora opemque cum Ladonis votis: depressaque ex
sub, declivibus tauri, aut his imitamina. Tellus guttae, tollens saeva addicere
si amanti certum postquam *sinistra digitos ut* metam oscula. Egit nivea
templisque foedus gemitus certasse aurigenae mala radicibus *erat equam* tota
et.`
    },
  };
}
