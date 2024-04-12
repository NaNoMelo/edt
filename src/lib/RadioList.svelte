<script lang="ts">
  export let value: String;
  export let options: string[] = [];
</script>

<div>
  {#each options as o}
    <label>
      <input type="radio" bind:group={value} value={o} />
      {o}
    </label>
  {/each}
</div>
