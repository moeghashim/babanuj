"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { SearchIcon } from "components/babanuj/icons";
import type { BabanujProduct } from "lib/babanuj/data";

const DEBOUNCE_MS = 220;
const MIN_QUERY = 2;
const PLACEHOLDER = "Search 240+ sweets, brands, gifts…";

export function SearchBar() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<BabanujProduct[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const isMac = useIsMac();

  // ⌘K / Ctrl-K → focus the input.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if ((e.metaKey || e.ctrlKey) && k === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Debounced fetch.
  useEffect(() => {
    const q = query.trim();
    if (q.length < MIN_QUERY) {
      setResults(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
        if (!res.ok) throw new Error(String(res.status));
        const data: { products: BabanujProduct[] } = await res.json();
        setResults(data.products);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [query]);

  // Click outside → close.
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!formRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    window.addEventListener("mousedown", onClick);
    return () => window.removeEventListener("mousedown", onClick);
  }, [open]);

  const closeAndReset = useCallback(() => {
    setOpen(false);
    setHighlighted(-1);
  }, []);

  const items = results ?? [];
  const showDropdown =
    open && query.trim().length >= MIN_QUERY && (loading || results !== null);

  const goToSearch = useCallback(
    (q: string) => {
      const trimmed = q.trim();
      if (!trimmed) return;
      closeAndReset();
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    },
    [router, closeAndReset],
  );

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      closeAndReset();
      inputRef.current?.blur();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (items.length === 0) return;
      setHighlighted((h) => Math.min(items.length - 1, h + 1));
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((h) => Math.max(-1, h - 1));
      return;
    }
    if (e.key === "Enter") {
      if (highlighted >= 0 && items[highlighted]) {
        e.preventDefault();
        const p = items[highlighted];
        closeAndReset();
        router.push(`/product/${p.handle}`);
      }
      // else allow default form submit → /search?q=…
    }
  };

  const shortcutHint = isMac ? "⌘K" : "Ctrl K";

  return (
    <form
      ref={formRef}
      className="mk-nav-search"
      action="/search"
      onSubmit={(e) => {
        // If we have a highlighted item, prefer navigating to it.
        if (highlighted >= 0 && items[highlighted]) {
          e.preventDefault();
          const p = items[highlighted];
          closeAndReset();
          router.push(`/product/${p.handle}`);
          return;
        }
        closeAndReset();
      }}
      style={{
        flex: 1,
        display: "flex",
        maxWidth: 640,
        margin: "0 auto",
        position: "relative",
        width: "100%",
      }}
      role="search"
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          background: "var(--paper)",
          borderRadius: showDropdown ? "22px 22px 0 0" : 999,
          padding: "12px 20px",
          gap: 10,
          border: showDropdown
            ? "1px solid var(--rule)"
            : "1px solid transparent",
          borderBottomColor: showDropdown ? "transparent" : undefined,
          transition: "border-radius .15s",
        }}
      >
        <SearchIcon width={18} height={18} />
        <input
          ref={inputRef}
          name="q"
          type="search"
          placeholder={PLACEHOLDER}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setHighlighted(-1);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          autoComplete="off"
          spellCheck={false}
          aria-autocomplete="list"
          aria-controls="search-typeahead"
          aria-expanded={showDropdown}
          style={{
            flex: 1,
            background: "transparent",
            border: 0,
            outline: "none",
            fontFamily: "inherit",
            fontSize: 14,
            color: "var(--ink)",
          }}
        />
        <span
          className="micro mk-search-kbd"
          aria-hidden
          style={{
            fontSize: 10,
            opacity: 0.5,
            padding: "4px 8px",
            border: "1px solid var(--rule)",
            borderRadius: 6,
          }}
        >
          {shortcutHint}
        </span>
      </div>

      {showDropdown && (
        <div
          id="search-typeahead"
          role="listbox"
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            background: "#fff",
            border: "1px solid var(--rule)",
            borderTop: "1px solid var(--rule)",
            borderRadius: "0 0 22px 22px",
            boxShadow: "0 18px 40px rgba(31,42,28,0.10)",
            zIndex: 40,
            overflow: "hidden",
            maxHeight: 480,
            overflowY: "auto",
          }}
        >
          {loading && results === null ? (
            <div
              style={{
                padding: "16px 22px",
                fontSize: 13,
                color: "var(--ink-2)",
              }}
            >
              Searching…
            </div>
          ) : items.length === 0 ? (
            <div
              style={{
                padding: "20px 22px",
                fontSize: 13,
                color: "var(--ink-2)",
                textAlign: "center",
              }}
            >
              No matches for{" "}
              <strong style={{ color: "var(--ink)" }}>“{query}”</strong>.
              <br />
              Try a different word, or{" "}
              <Link
                href="/search"
                onClick={closeAndReset}
                style={{
                  color: "var(--accent)",
                  textDecoration: "underline",
                  textUnderlineOffset: 3,
                  fontWeight: 600,
                }}
              >
                browse the pantry
              </Link>
              .
            </div>
          ) : (
            <>
              <div
                role="presentation"
                className="micro"
                style={{
                  padding: "10px 18px 6px",
                  color: "var(--ink-2)",
                  fontSize: 10.5,
                }}
              >
                Products
              </div>
              {items.map((p, i) => (
                <Link
                  key={p.id}
                  role="option"
                  aria-selected={i === highlighted}
                  href={`/product/${p.handle}`}
                  onClick={closeAndReset}
                  onMouseEnter={() => setHighlighted(i)}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "44px 1fr auto",
                    gap: 12,
                    alignItems: "center",
                    padding: "10px 18px",
                    textDecoration: "none",
                    color: "inherit",
                    background:
                      i === highlighted ? "var(--paper)" : "transparent",
                    transition: "background .12s",
                  }}
                >
                  <span
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 10,
                      overflow: "hidden",
                      position: "relative",
                      background: p.hue,
                      flexShrink: 0,
                    }}
                  >
                    {p.img && (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={p.img}
                        alt=""
                        style={{
                          position: "absolute",
                          inset: 0,
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    )}
                  </span>
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 13.5,
                        fontWeight: 700,
                        lineHeight: 1.2,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {p.name}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "var(--ink-2)",
                        marginTop: 2,
                      }}
                    >
                      {p.brand}
                    </div>
                  </div>
                  <div
                    className="num"
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: "var(--ink)",
                    }}
                  >
                    ${p.price.toFixed(2)}
                  </div>
                </Link>
              ))}
              <button
                type="button"
                onClick={() => goToSearch(query)}
                style={{
                  width: "100%",
                  padding: "12px 18px",
                  background: "var(--paper)",
                  border: 0,
                  borderTop: "1px solid var(--rule)",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontSize: 13,
                  fontWeight: 700,
                  textAlign: "left",
                  color: "var(--accent-dark)",
                }}
              >
                See all results for “{query.trim()}” →
              </button>
            </>
          )}
        </div>
      )}
    </form>
  );
}

function useIsMac() {
  const [isMac, setIsMac] = useState(true);
  useEffect(() => {
    const ua = navigator.userAgent || "";
    setIsMac(/Mac|iPhone|iPad/.test(ua));
  }, []);
  return isMac;
}
