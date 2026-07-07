// @vitest-environment jsdom
import { cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// TURNSTILE_SITE_KEY is captured at module load, so each test stubs the env
// first and imports the component fresh.
async function loadWidget() {
  const mod = await import("./TurnstileWidget");
  return mod.default;
}

beforeEach(() => {
  vi.resetModules();
});

afterEach(() => {
  cleanup();
  vi.unstubAllEnvs();
  delete (window as { turnstile?: unknown }).turnstile;
  document
    .querySelectorAll("script[src*='challenges.cloudflare.com']")
    .forEach((s) => s.remove());
});

describe("TurnstileWidget", () => {
  it("renders nothing when NEXT_PUBLIC_TURNSTILE_SITE_KEY is not set (feature off)", async () => {
    vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY", "");
    const TurnstileWidget = await loadWidget();
    const { container } = render(<TurnstileWidget onToken={() => {}} />);
    expect(container.innerHTML).toBe("");
    expect(
      document.querySelector("script[src*='challenges.cloudflare.com']"),
    ).toBeNull();
  });

  it("renders each widget with the site key and forwards tokens to onToken", async () => {
    vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY", "test-site-key");
    const renderMock = vi.fn().mockReturnValue("widget-1");
    const removeMock = vi.fn();
    (window as unknown as { turnstile: unknown }).turnstile = {
      render: renderMock,
      remove: removeMock,
    };

    const TurnstileWidget = await loadWidget();
    const onToken = vi.fn();
    const { unmount } = render(<TurnstileWidget onToken={onToken} />);

    expect(renderMock).toHaveBeenCalledOnce();
    const [el, opts] = renderMock.mock.calls[0];
    expect((el as HTMLElement).className).toBe("turnstile-slot");
    expect(opts.sitekey).toBe("test-site-key");

    // Success hands the token up; expiry and error blank it so the host form
    // re-disables its submit button.
    opts.callback("tok-123");
    expect(onToken).toHaveBeenLastCalledWith("tok-123");
    opts["expired-callback"]();
    expect(onToken).toHaveBeenLastCalledWith("");
    opts["error-callback"]();
    expect(onToken).toHaveBeenLastCalledWith("");

    // Unmount removes the Cloudflare widget instance.
    unmount();
    expect(removeMock).toHaveBeenCalledWith("widget-1");
  });

  it("injects the Cloudflare script exactly once and renders every widget on load", async () => {
    vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY", "test-site-key");
    const TurnstileWidget = await loadWidget();
    render(
      <>
        <TurnstileWidget onToken={() => {}} />
        <TurnstileWidget onToken={() => {}} />
      </>,
    );
    const scripts = document.querySelectorAll(
      "script[src*='challenges.cloudflare.com/turnstile']",
    );
    expect(scripts).toHaveLength(1);
    expect((scripts[0] as HTMLScriptElement).src).toContain("render=explicit");

    // When the (single) script finishes loading, each widget renders itself.
    const renderMock = vi.fn().mockReturnValue("widget-x");
    (window as unknown as { turnstile: unknown }).turnstile = {
      render: renderMock,
      remove: vi.fn(),
    };
    scripts[0].dispatchEvent(new Event("load"));
    expect(renderMock).toHaveBeenCalledTimes(2);
  });
});
