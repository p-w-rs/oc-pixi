import type { Rpc } from "@opencode/plugin/rpc"
import type { Settings } from "./settings.js"

const output = {} as const
const object = (properties: Record<string, unknown>, required: string[] = []) => ({ type: "object", properties, required, additionalProperties: false }) as const

export const PixiRpc = {
  id: "oc-pixi.admin",
  methods: {
    state: { input: object({}), output },
    update: { input: object({ guide: { type: "boolean" }, hints: { type: "boolean" }, docs: { type: "boolean" } }), output },
  },
  events: {},
} as const satisfies Rpc.PortableDefinition

export interface StateView {
  readonly version: string
  readonly settings: Settings
  readonly dataDirectory: string
  /** The pixi on PATH for OpenCode's shell, if any. */
  readonly pixi?: { readonly path: string; readonly version: string }
  readonly docs: { readonly version: string; readonly pages: number }
  /** Hints given since OpenCode started, by kind. */
  readonly hinted: Record<string, number>
}
