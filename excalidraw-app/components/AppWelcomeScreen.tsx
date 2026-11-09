import { WelcomeScreen } from "@excalidraw/excalidraw/index";
import React from "react";
import { Library, PanelLeft, Plus, Shapes } from "lucide-react";

import { TharunFlowMark } from "@excalidraw/excalidraw/components/ExcalidrawLogo";

import "./AppWelcomeScreen.scss";

export const AppWelcomeScreen: React.FC<{
  onCollabDialogOpen: () => any;
  isCollabEnabled: boolean;
  onNewDiagram?: () => void;
  onOpenHistory?: () => void;
  onOpenIcons?: () => void;
  onOpenLibraries?: () => void;
}> = React.memo((props) => {
  return (
    <WelcomeScreen>
      <WelcomeScreen.Hints.MenuHint>⌘S to save</WelcomeScreen.Hints.MenuHint>
      <WelcomeScreen.Hints.ToolbarHint />
      <WelcomeScreen.Center>
        <WelcomeScreen.Center.Logo>
          <div className="tf-welcome-brand">
            <TharunFlowMark className="tf-welcome-brand__mark" />
            <span className="tf-welcome-brand__text">tharun-flow</span>
          </div>
        </WelcomeScreen.Center.Logo>
        <WelcomeScreen.Center.Heading>
          <span className="tf-welcome-heading">
            <span className="tf-welcome-heading__title">
              Diagrams that flow.
            </span>
            <span className="tf-welcome-heading__sub">
              Sketch ideas, map systems, and ship clarity.
            </span>
          </span>
        </WelcomeScreen.Center.Heading>
        <WelcomeScreen.Center.Menu>
          {props.onNewDiagram && (
            <WelcomeScreen.Center.MenuItem
              onSelect={props.onNewDiagram}
              icon={<Plus size={18} />}
            >
              New diagram
            </WelcomeScreen.Center.MenuItem>
          )}
          {props.onOpenHistory && (
            <WelcomeScreen.Center.MenuItem
              onSelect={props.onOpenHistory}
              icon={<PanelLeft size={18} />}
            >
              Diagram history
            </WelcomeScreen.Center.MenuItem>
          )}
          {props.onOpenIcons && (
            <WelcomeScreen.Center.MenuItem
              onSelect={props.onOpenIcons}
              icon={<Shapes size={18} />}
            >
              Architecture & tech icons
            </WelcomeScreen.Center.MenuItem>
          )}
          {props.onOpenLibraries && (
            <WelcomeScreen.Center.MenuItem
              onSelect={props.onOpenLibraries}
              icon={<Library size={18} />}
            >
              Libraries
            </WelcomeScreen.Center.MenuItem>
          )}
          <WelcomeScreen.Center.MenuItemLoadScene />
          {props.isCollabEnabled && (
            <WelcomeScreen.Center.MenuItemLiveCollaborationTrigger
              onSelect={props.onCollabDialogOpen}
            />
          )}
        </WelcomeScreen.Center.Menu>
      </WelcomeScreen.Center>
    </WelcomeScreen>
  );
});
