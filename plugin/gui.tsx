import { Plugin, SettingsPage, type Context } from "@opencode/plugin/gui"
import { createSignal, onMount, Show, type JSX } from "solid-js"
import { PixiRpc, type StateView } from "./rpc.js"

const muted: JSX.CSSProperties = { opacity: 0.7, "font-size": "12px" }
const card: JSX.CSSProperties = { border: "1px solid color-mix(in srgb, currentColor 14%, transparent)", "border-radius": "8px", padding: "12px", display: "flex", "flex-direction": "column", gap: "8px" }
const message = (error: unknown) => (error instanceof Error ? error.message : String(error)).replace(/^.*?Error: /, "")

function PixiView(props: { ctx: Context }) {
  const { ctx } = props
  const [state, setState] = createSignal<StateView>()
  const [error, setError] = createSignal<string>()
  const api = () => ctx.client.rpc(PixiRpc)
  const refresh = async () => { try { setState(await api().state({}) as unknown as StateView); setError(undefined) } catch (cause) { setError(message(cause)) } }
  const update = async (patch: Record<string, boolean>) => {
    try { setState(await api().update(patch) as unknown as StateView) } catch (cause) { ctx.toast.show({ title: "Pixi", description: message(cause), variant: "error" }) }
  }
  onMount(() => void refresh())
  const toggle = (key: "guide" | "hints" | "docs", title: string, text: string) => (
    <div style={card}>
      <ctx.ui.Switch label={title} checked={state()!.settings[key]} onChange={value => void update({ [key]: value })} />
      <span style={muted}>{text}</span>
    </div>
  )
  const hinted = () => Object.values(state()?.hinted ?? {}).reduce((a, b) => a + b, 0)
  return (
    <div style={{ display: "flex", "flex-direction": "column", gap: "12px", "font-size": "13px" }}>
      <Show when={error() && !state()}><div style={{ color: "#e03131" }}>oc-pixi is not answering: {error()}. Is it installed on this server?</div></Show>
      <Show when={!state() && !error()}><ctx.ui.Loader /></Show>
      <Show when={state()}>{current => <>
        <Show when={!current().pixi}><div style={{ ...card, color: "#e8590c" }}>Pixi was not found on OpenCode's PATH. Install it from pixi.sh (curl -fsSL https://pixi.sh/install.sh | sh), then restart OpenCode.</div></Show>
        {toggle("guide", "Pixi first", "Agents are told to use Pixi for Python (standalone scripts with inline dependencies, workspaces for projects) and for other toolchains (C/C++, Rust, Go, Node, R, CUDA …), and get a pixi skill with tested recipes.")}
        {toggle("hints", "Hints when agents bypass Pixi", "When an agent runs pip, uv, python, conda, venv or poetry directly, the command runs as usual and the agent gets a one-line Pixi equivalent with the result. Nothing is ever blocked.")}
        {toggle("docs", "Pixi documentation", "Adds pixi_docs: agents search and read the full Pixi documentation bundled with this plugin (works offline).")}
        <span style={muted}>oc-pixi {current().version} · Pixi {current().pixi ? `${current().pixi!.version} (${current().pixi!.path})` : "not found"} · bundled docs for Pixi {current().docs.version} ({current().docs.pages} pages){hinted() ? ` · ${hinted()} hints given since OpenCode started` : ""}</span>
      </>}</Show>
    </div>
  )
}

export default Plugin.define({
  setup(ctx) {
    ctx.add(SettingsPage, {
      id: "pixi", title: "Pixi", icon: "cube",
      entries: [{ id: "pixi", title: "Pixi", description: "Agents use Pixi for Python and toolchains; hints; bundled docs", keywords: "oc-pixi pixi python pip uv conda venv environment toolchain" }],
      render: () => (
        <ctx.ui.SettingsLayout title="Pixi" description="Helps agents use Pixi for reproducible environments. OpenCode's own tools are never changed or blocked.">
          <PixiView ctx={ctx} />
        </ctx.ui.SettingsLayout>
      ),
    })
  },
})
