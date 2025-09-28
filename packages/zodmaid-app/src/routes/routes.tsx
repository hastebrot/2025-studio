import { useEffect } from "react";
import { useNavigate, type RouteObject } from "react-router";
import { InputFieldSizingPage } from "./iris/input-field-sizing-page";
import { IrisColorsPage } from "./iris/iris-colors-page";
import { IrisHillChartPage } from "./iris/iris-hill-chart-page";
import { IrisLayoutPage } from "./iris/iris-layout-page";
import { IrisScopeMapPage } from "./iris/iris-scope-map-page";
import { LexTextboxFocusPage } from "./iris/lex-textbox-focus-page";
import { LexTextboxPage } from "./iris/lex-textbox-page";
import { OctoDiagramAntvPage } from "./octo/diagram-antv-page";
import { OctoDiagramPage } from "./octo/diagram-page";
import { GridViewDynamicPage } from "./tetra/grid-view-dynamic-page";
import { GridViewStaticPage } from "./tetra/grid-view-static-page";
import { GridViewStyledPage } from "./tetra/grid-view-styled-page";
import { MobxObserverPage } from "./tetra/mobx-observer-page";
import { MockupGridPage } from "./tetra/mockup-grid-page";
import { ReactDataGridPage } from "./tetra/react-data-grid-page";
import { TriDynamicPage } from "./tri/tri-dynamic-page";
import { TriStaticPage } from "./tri/tri-static-page";

// dagre, https://github.com/antvis/layout/blob/v5/packages/layout/src/dagre.ts
// - uses @dagrejs/dagre, https://github.com/dagrejs/dagre
// - uses @dagrejs/graphlib, https://github.com/dagrejs/graphlib
// antv dagre, https://github.com/antvis/layout/blob/v5/packages/layout/src/antv-dagre.ts
// - uses @antv/graphlib, https://github.com/antvis/graphlib/tree/master/src
// rust dagre, https://github.com/antvis/layout/tree/v5/packages/layout-rust/src/dagre
// - uses @antv/layout-rust, https://github.com/antvis/layout/tree/v5/packages/layout-rust/src/dagre
// - uses graphlib_rust, https://crates.io/crates/graphlib_rust
// - uses dagre_rust, https://crates.io/crates/dagre_rust

export const routes: RouteObject[] = [
  {
    path: "/",
    Component: () => {
      const navigate = useNavigate();
      useEffect(() => {
        navigate("/tetra/grid-dynamic", { replace: true });
      }, []);
      return null;
    },
  },
  {
    path: "/iris",
    children: [
      // wrap.
      { path: "colors", Component: () => <IrisColorsPage /> },
      { path: "layout", Component: () => <IrisLayoutPage /> },
      { path: "textbox", Component: () => <LexTextboxPage /> },
      { path: "textbox-focus", Component: () => <LexTextboxFocusPage /> },
      { path: "input", Component: () => <InputFieldSizingPage /> },
      { path: "hill-chart", Component: () => <IrisHillChartPage /> },
      { path: "scope-map", Component: () => <IrisScopeMapPage /> },
    ],
  },
  {
    path: "/octo",
    children: [
      // wrap.
      { path: "", Component: () => <OctoDiagramPage /> },
      { path: "antv", Component: () => <OctoDiagramAntvPage /> },
    ],
  },
  {
    path: "/tetra",
    children: [
      // wrap.
      { path: "grid-dynamic", Component: () => <GridViewDynamicPage /> },
      { path: "grid-static", Component: () => <GridViewStaticPage /> },
      { path: "grid-styled", Component: () => <GridViewStyledPage /> },
      { path: "mockup", Component: () => <MockupGridPage /> },
      { path: "react-data-grid", Component: () => <ReactDataGridPage /> },
      { path: "mobx", Component: () => <MobxObserverPage /> },
    ],
  },
  {
    path: "/tri",
    children: [
      // wrap.
      { path: "grid-static", Component: () => <TriStaticPage /> },
      { path: "grid-dynamic", Component: () => <TriDynamicPage /> },
    ],
  },
];
