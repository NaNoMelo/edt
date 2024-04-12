<script lang="ts">
  import RadioList from "./RadioList.svelte";

  const placeholder: string = `PS25 CM1 lundi 10:15 12:15 1 Présentiel P340
MAA1+MAA2 TP1 A lundi 16:15 18:15 2 Présentiel P120, P206
PS25 TP1 B lundi 16:15 18:15 2 Présentiel P001
MAA1+MAA2 CM1 mardi 10:15 12:15 1 Présentiel P418
HE05 CM1 mardi 16:15 17:45 1 Présentiel P340
HE05 TD1 mardi 17:45 19:45 1 Présentiel P340
PS25 TD1 jeudi 08:00 10:00 1 Présentiel P134a
LC02 TD1 jeudi 14:00 16:00 1 Présentiel B457
LC02 TP1 jeudi 16:15 17:15 1 Présentiel B457
MAA1+MAA2 TD2 vendredi 08:00 10:00 1 Présentiel P127
IF3B+IF3E CM2 vendredi 14:00 16:00 1 Présentiel P457
IF3B+IF3E CM2 vendredi 16:15 18:15 1 Présentiel P457`;

  export let input: string = "";
  export let download = "PDF";
  export let printable = false;
  function onInput() {
    console.log("input");
    console.log(input);
    alert(input);
  }

  function generate() {
    console.log("generate");
    console.log(input);
    alert(input);
  }
</script>

<textarea id="edt" cols="30" rows="10" {placeholder} bind:value={input} /><br />
<input type="checkbox" bind:value={printable} id="bandw" />
<label for="bandw">Mode impression (pas de fond)</label>
<div id="download-option">
  Télécharger ?
  <RadioList bind:value={download} options={["no", "PNG", "PDF"]} />
</div>
{input}
<input type="button" class="nostyle" value="générer" on:click={generate} />
