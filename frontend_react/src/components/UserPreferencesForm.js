import React, { useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";
import UserPreferenceAPI from "../api/UserPreferenceAPI";

export default function UserPreferencesForm({ userPreferences }) {
  const [operatingSystem, setOperatingSystem] = useState(userPreferences?.operating_system?.value ?? "");
  const [applicationCategories, setApplicationCategories] = useState(
    userPreferences?.application_categories?.value ?? []
  );

  function onOperatingSystemChange(value) {
    if (operatingSystem !== value) {
      UserPreferenceAPI.patch(userPreferences.id, { operating_system: value }).then(() => {
        setOperatingSystem(value);
      });
    }
  }

  function onApplicationCategoriesChange(value) {
    if (applicationCategories !== value) {
      UserPreferenceAPI.patch(userPreferences.id, { application_categories: value }).then(() => {
        setApplicationCategories(value);
      });
    }
  }

  return (
    <>
      <table>
        <tbody>
          <tr>
            <td className="text-left">{userPreferences.operating_system.label}:</td>
            <td>
              <Dropdown
                value={operatingSystem}
                onChange={(e) => onOperatingSystemChange(e.value)}
                options={userPreferences.operating_system.choices}
                optionLabel="label"
                placeholder="Select"
                className="w-full md:w-14rem"
              />
            </td>
          </tr>
          <tr>
            <td className="text-left">{userPreferences.application_categories.label}:</td>
            <td>
              {/* <MultiSelect
                value={applicationCategories}
                onChange={(e) => onApplicationCategoriesChange(e.value)}
                options={userPreferences.application_categories.choices}
                optionLabel="label"
                placeholder="Select"
                className="w-full md:w-20rem"
                style={{ minWidth: "100px", maxWidth: "500px" }}
              /> */}
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
}
