import React, { useEffect } from "react";
import styles from "./tabbed-view.css";
import {
  ConfigurableLink,
  ExtensionSlot,
  navigate,
  useAssignedExtensionIds,
} from "@openmrs/esm-framework";
import { useRouteMatch } from "react-router-dom";
import { DashboardTabConfig } from "../config-schemas";
import { basePath, moduleName } from "../constants";
import { getTitle } from "../utils";

interface ShowTabsProps {
  slot: string;
  view: string;
  fullPath: string;
}

const ShowTabs: React.FC<ShowTabsProps> = ({ slot, view, fullPath }) => {
  const extensions = useAssignedExtensionIds(moduleName, slot);
  const defaultExtension = extensions[0];

  useEffect(() => {
    if (!view && defaultExtension) {
      navigate({
        to: `${fullPath}/${defaultExtension.meta.view}`,
      });
    }
  }, [view, defaultExtension, fullPath]);

  return (
    <ul>
      {view &&
        extensions.map((ext) => (
          <li key={ext.name}>
            <div
              className={`${
                ext.meta.view === view ? "selected" : "unselected"
              }`}
            >
              <ConfigurableLink to={`${fullPath}/${ext.meta.view}`}>
                <button className="omrs-unstyled">{getTitle(ext)}</button>
              </ConfigurableLink>
            </div>
          </li>
        ))}
    </ul>
  );
};

export interface TabbedViewProps {
  name: string;
  slot: string;
  patientUuid: string;
  patient: fhir.Patient;
  tab: string;
  layout: DashboardTabConfig;
}

const TabbedView: React.FC<TabbedViewProps> = ({
  name,
  slot,
  patient,
  patientUuid,
  tab,
}) => {
  const { url } = useRouteMatch(basePath);
  const fullPath = `${window.spaBase}${url}/${name}`;
  const state = React.useMemo(
    () => ({
      basePath: url,
      fullPath,
      patientUuid,
      patient,
      view: tab,
    }),
    [patientUuid, patient, tab, fullPath, url]
  );

  return (
    <>
      <nav className={styles.summariesnav}>
        <ShowTabs slot={slot} view={tab} fullPath={fullPath} />
      </nav>
      <ExtensionSlot
        className={styles.routesContainer}
        extensionSlotName={slot}
        state={state}
        select={(extensions) =>
          extensions.filter((ext) => ext.meta.view === tab)
        }
      />
    </>
  );
};

export default TabbedView;
