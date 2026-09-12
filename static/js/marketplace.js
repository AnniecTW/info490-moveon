/**
 * MoveOn — browse-page interactions.
 *
 * Plain ES modules-free vanilla JS: no bundler, no framework, nothing to install.
 * Django renders every listing card server side; this file only filters, sorts
 * and decorates what is already in the DOM.
 *
 * The contract with the templates is the `data-*` attributes documented in
 * templates/marketplace/partials/_listing_card.html and _filters.html.
 *
 * When real server-side search/filtering lands, delete the filter pipeline here
 * and let the form submit normally — the markup already degrades to a plain GET.
 */
(function () {
  "use strict";

  const FAVORITES_KEY = "moveon:favorites";

  document.addEventListener("DOMContentLoaded", function () {
    setUpFavorites();

    const root = document.querySelector("[data-marketplace]");
    if (root) {
      collapseFiltersOnSmallScreens(root);
      setUpBrowse(root);
    }
  });

  /**
   * The filter panel is a <details open> so it still works without JS, but on a
   * phone that buries the listings under a full screen of checkboxes. Collapse
   * it there; from `lg` up the sidebar is always visible.
   */
  function collapseFiltersOnSmallScreens(root) {
    const panel = root.querySelector("[data-filter-panel]");
    if (panel && window.matchMedia("(max-width: 1023px)").matches) {
      panel.open = false;
    }
  }

  /* ----------------------------------------------------------------------- *
   * Browse: filters + sort + search
   * ----------------------------------------------------------------------- */

  function setUpBrowse(root) {
    const grid = root.querySelector("[data-listing-grid]");
    if (!grid) return;

    const cards = Array.from(grid.querySelectorAll("[data-listing-card]"));
    const form = root.querySelector("[data-filter-form]");
    const noResults = root.querySelector("[data-no-results]");
    const sortSelect = root.querySelector("[data-sort]");
    const countEl = root.querySelector("[data-result-count]");
    const pluralEl = root.querySelector("[data-result-plural]");

    const searchForm = document.querySelector("[data-search-form]");
    const searchInput = searchForm ? searchForm.querySelector('input[type="search"]') : null;

    const slider = setUpPriceSlider(root, apply);

    // Pre-parse each card once so filtering stays cheap.
    const entries = cards.map(function (card) {
      return {
        el: card,
        price: parseFloat(card.dataset.price) || 0,
        created: parseInt(card.dataset.created, 10) || 0,
        title: (card.dataset.title || "").toLowerCase(),
        category: card.dataset.category || "",
        condition: card.dataset.condition || "",
        fulfillment: card.dataset.fulfillment || "",
        bundle: card.dataset.bundle === "1",
        keywords: (card.dataset.keywords || "").toLowerCase().replace(/\s+/g, " "),
      };
    });

    /** Values of every checked checkbox for one facet, as a Set. */
    function selected(facet) {
      const boxes = root.querySelectorAll(
        '[data-filter="' + facet + '"]:checked:not([value="__all__"])'
      );
      return new Set(Array.from(boxes, (box) => box.value));
    }

    function apply() {
      const categories = selected("category");
      const conditions = selected("condition");
      const fulfillments = selected("fulfillment");
      const bundleOnly = !!root.querySelector('[data-filter="bundle"]:checked');
      const price = slider ? slider.value() : null;
      const terms = searchInput
        ? searchInput.value.toLowerCase().split(/\s+/).filter(Boolean)
        : [];

      let visible = 0;

      entries.forEach(function (entry) {
        const matches =
          (categories.size === 0 || categories.has(entry.category)) &&
          (conditions.size === 0 || conditions.has(entry.condition)) &&
          (fulfillments.size === 0 || fulfillments.has(entry.fulfillment)) &&
          (!bundleOnly || entry.bundle) &&
          (!price || (entry.price >= price.min && entry.price <= price.max)) &&
          terms.every((term) => entry.keywords.indexOf(term) !== -1);

        entry.el.hidden = !matches;
        if (matches) visible += 1;
      });

      if (countEl) countEl.textContent = String(visible);
      if (pluralEl) pluralEl.textContent = visible === 1 ? "" : "es";
      if (noResults) noResults.hidden = visible !== 0 || entries.length === 0;
      grid.hidden = visible === 0 && entries.length > 0;
    }

    function sortBy(mode) {
      const sorted = entries.slice().sort(function (a, b) {
        switch (mode) {
          case "price-asc":
            return a.price - b.price;
          case "price-desc":
            return b.price - a.price;
          case "title-asc":
            return a.title.localeCompare(b.title);
          default: // "newest"
            return b.created - a.created;
        }
      });
      // Re-append in order; only cards move, other grid children stay put.
      sorted.forEach((entry) => grid.appendChild(entry.el));
    }

    /* ---- Wiring ---- */

    if (form) {
      form.addEventListener("change", function (event) {
        const input = event.target;
        if (input.dataset.filter === "category") {
          syncAllItemsCheckbox(root, input);
        }
        apply();
      });

      // `type="reset"` clears inputs *after* this event, so defer the re-filter.
      form.addEventListener("reset", function () {
        window.setTimeout(function () {
          if (slider) slider.reset();
          if (searchInput) searchInput.value = "";
          apply();
        }, 0);
      });
    }

    // The "Reset filters" button inside the empty state lives outside the form.
    root.querySelectorAll("[data-filter-reset]").forEach(function (button) {
      if (form && form.contains(button)) return;
      button.addEventListener("click", function () {
        if (form) form.reset();
        window.setTimeout(function () {
          if (slider) slider.reset();
          if (searchInput) searchInput.value = "";
          apply();
        }, 0);
      });
    });

    if (sortSelect) {
      sortSelect.addEventListener("change", function () {
        sortBy(sortSelect.value);
      });
    }

    if (searchForm && searchInput) {
      // Filtering is client side for now, so never round-trip to the server.
      searchForm.addEventListener("submit", function (event) {
        event.preventDefault();
        apply();
      });
      searchInput.addEventListener("input", debounce(apply, 150));
    }

    apply();
  }

  /**
   * "All items" and the individual categories are mutually exclusive:
   * ticking one clears the other, and clearing everything falls back to "All".
   */
  function syncAllItemsCheckbox(root, changed) {
    const all = root.querySelector('[data-filter="category"][value="__all__"]');
    if (!all) return;

    const others = Array.from(
      root.querySelectorAll('[data-filter="category"]:not([value="__all__"])')
    );

    if (changed === all) {
      if (all.checked) others.forEach((box) => (box.checked = false));
    } else if (changed.checked) {
      all.checked = false;
    }

    if (!others.some((box) => box.checked)) all.checked = true;
  }

  /* ----------------------------------------------------------------------- *
   * Dual-handle price slider
   * ----------------------------------------------------------------------- */

  function setUpPriceSlider(root, onChange) {
    const slider = root.querySelector("[data-price-slider]");
    if (!slider) return null;

    const minInput = slider.querySelector('[data-filter="price-min"]');
    const maxInput = slider.querySelector('[data-filter="price-max"]');
    const fill = slider.querySelector("[data-price-fill]");
    const minLabel = root.querySelector("[data-price-min-label]");
    const maxLabel = root.querySelector("[data-price-max-label]");
    if (!minInput || !maxInput) return null;

    const floor = parseFloat(slider.dataset.floor) || 0;
    const ceiling = parseFloat(slider.dataset.ceiling) || 0;
    const span = ceiling - floor;

    function clamp() {
      let low = parseFloat(minInput.value);
      let high = parseFloat(maxInput.value);
      if (low > high) {
        // Push the handle the user is *not* dragging out of the way.
        if (document.activeElement === minInput) {
          high = low;
          maxInput.value = String(high);
        } else {
          low = high;
          minInput.value = String(low);
        }
      }
      return { min: low, max: high };
    }

    function paint() {
      const { min, max } = clamp();
      if (minLabel) minLabel.textContent = "$" + min;
      if (maxLabel) maxLabel.textContent = "$" + max + (max >= ceiling ? "+" : "");
      if (fill) {
        const start = span > 0 ? ((min - floor) / span) * 100 : 0;
        const end = span > 0 ? ((max - floor) / span) * 100 : 100;
        fill.style.left = start + "%";
        fill.style.width = Math.max(end - start, 0) + "%";
      }
    }

    [minInput, maxInput].forEach(function (input) {
      input.addEventListener("input", function () {
        paint();
        onChange();
      });
    });

    paint();

    return {
      value: clamp,
      reset: function () {
        minInput.value = String(floor);
        maxInput.value = String(ceiling);
        paint();
      },
    };
  }

  /* ----------------------------------------------------------------------- *
   * Favorites (localStorage only — swap for a real endpoint when auth lands)
   * ----------------------------------------------------------------------- */

  function setUpFavorites() {
    const buttons = document.querySelectorAll("[data-favorite-toggle]");
    if (!buttons.length) return;

    const saved = readFavorites();

    buttons.forEach(function (button) {
      const id = button.dataset.favoriteId;
      paintFavorite(button, saved.has(id));

      button.addEventListener("click", function () {
        const current = readFavorites();
        const next = !current.has(id);
        if (next) {
          current.add(id);
        } else {
          current.delete(id);
        }
        writeFavorites(current);
        paintFavorite(button, next);
      });
    });
  }

  function paintFavorite(button, active) {
    button.setAttribute("aria-pressed", active ? "true" : "false");
    const path = button.querySelector("[data-heart-fill]");
    if (path) path.setAttribute("fill", active ? "currentColor" : "none");
  }

  function readFavorites() {
    try {
      const raw = window.localStorage.getItem(FAVORITES_KEY);
      return new Set(raw ? JSON.parse(raw) : []);
    } catch (error) {
      return new Set();
    }
  }

  function writeFavorites(set) {
    try {
      window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(Array.from(set)));
    } catch (error) {
      /* Private browsing / storage disabled — favorites just don't persist. */
    }
  }

  /* ----------------------------------------------------------------------- */

  function debounce(fn, wait) {
    let timer = null;
    return function () {
      window.clearTimeout(timer);
      timer = window.setTimeout(fn, wait);
    };
  }
})();
