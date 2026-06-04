import { useState } from "react";
import { useCreateMod } from "../hooks";

import StepBasicInfo from "../pages/StepBasicInfo";
import StepMediaLinks from "../pages/StepMediaLinks";
import StepMediaInfo from "../pages/StepMediaContent";

import styles from "./CreateModForm.module.css";

export default function CreateModForm() {
  const { mutateAsync, isPending } = useCreateMod();

  const [step, setStep] = useState(1);

  const [data, setData] = useState({
    //////////////////////////////////////////////////
    // BASIC
    //////////////////////////////////////////////////

    title: "",

    summary: "",

    description: "",

    content: "",

    license: "",

    //////////////////////////////////////////////////
    // LINKS
    //////////////////////////////////////////////////

    sourceUrl: "",

    issuesUrl: "",

    discordUrl: "",

    websiteUrl: "",

    wikiUrl: "",

    donationUrl: "",

    //////////////////////////////////////////////////
    // META
    //////////////////////////////////////////////////

    platform: "",

    loader: "",

    type: "",

    visibility: "PUBLIC",

    //////////////////////////////////////////////////
    // ARRAYS
    //////////////////////////////////////////////////

    categories: [] as string[],

    tags: [] as string[],

    //////////////////////////////////////////////////
    // FILES
    //////////////////////////////////////////////////

    icon: null as File | null,

    gallery: [] as File[],
  });

  ////////////////////////////////////////
  // NAVIGATION
  ////////////////////////////////////////

  const nextStep = () => {
    if (step === 1) {
      if (
        !data.title ||
        !data.description ||
        !data.type ||
        !data.platform
      ) {
        alert("Completa los campos obligatorios ⚠️");
        return;
      }
    }

    setStep((s) => Math.min(s + 1, 3));
  };

  const prevStep = () => {
    setStep((s) => Math.max(s - 1, 1));
  };

  ////////////////////////////////////////
  // SUBMIT FINAL
  ////////////////////////////////////////

  const handleSubmit = async () => {
    try {
      const formData = new FormData();

      //////////////////////////////////////////////////
      // BASIC
      //////////////////////////////////////////////////

      formData.append(
        "title",
        data.title
      );

      formData.append(
        "summary",
        data.summary
      );

      formData.append(
        "description",
        data.description
      );

      formData.append(
        "content",
        data.content
      );

      formData.append(
        "license",
        data.license
      );

      //////////////////////////////////////////////////
      // LINKS
      //////////////////////////////////////////////////

      formData.append(
        "sourceUrl",
        data.sourceUrl
      );

      formData.append(
        "issuesUrl",
        data.issuesUrl
      );

      formData.append(
        "discordUrl",
        data.discordUrl
      );

      formData.append(
        "websiteUrl",
        data.websiteUrl
      );

      formData.append(
        "wikiUrl",
        data.wikiUrl
      );

      formData.append(
        "donationUrl",
        data.donationUrl
      );

      //////////////////////////////////////////////////
      // META
      //////////////////////////////////////////////////

      formData.append(
        "platform",
        data.platform
      );

      formData.append(
        "loader",
        data.loader || ""
      );

      formData.append(
        "type",
        data.type
      );

      formData.append(
        "visibility",
        data.visibility
      );

      //////////////////////////////////////////////////
      // ARRAYS
      //////////////////////////////////////////////////

      formData.append(
        "categories",
        JSON.stringify(
          data.categories
        )
      );

      formData.append(
        "tags",
        JSON.stringify(data.tags)
      );

      //////////////////////////////////////////////////
      // ICON
      //////////////////////////////////////////////////

      if (data.icon) {
        formData.append(
          "icon",
          data.icon
        );
      }

      //////////////////////////////////////////////////
      // GALLERY
      //////////////////////////////////////////////////

      data.gallery.forEach((file) => {
        formData.append(
          "gallery",
          file
        );
      });

      //////////////////////////////////////////////////
      // SUBMIT
      //////////////////////////////////////////////////

      await mutateAsync(formData);

      alert(
        "🚀 Mod creado correctamente"
      );

      //////////////////////////////////////////////////
      // RESET
      //////////////////////////////////////////////////

      setStep(1);

      setData({
        title: "",
        summary: "",
        description: "",
        content: "",
        license: "",

        sourceUrl: "",
        issuesUrl: "",
        discordUrl: "",
        websiteUrl: "",
        wikiUrl: "",
        donationUrl: "",

        platform: "",
        loader: "",
        type: "",

        visibility: "PUBLIC",

        categories: [],
        tags: [],

        icon: null,

        gallery: [],
      });

    } catch (error) {
      console.error(error);

      alert(
        "❌ Error al crear el mod"
      );
    }
  };

  ////////////////////////////////////////
  // UI
  ////////////////////////////////////////

  return (
    <div>
      {/* indicador */}
      <div className={styles.steps}>
        <span className={styles.active}>
          Create Basic Info
        </span>

        {step >= 2 && (
          <>
            <span>›</span>
            <span
              className={
                step === 2
                  ? styles.active
                  : undefined
              }
            >
              Data Web
            </span>
          </>
        )}

        {step >= 3 && (
          <>
            <span>›</span>
            <span
              className={
                step === 3
                  ? styles.active
                  : undefined
              }
            >
              Data Mod
            </span>
          </>
        )}
      </div>

      {/* contenido */}
      {step === 1 && (
        <StepBasicInfo
          data={data}
          setData={setData}
          next={nextStep}
        />
      )}

      {step === 2 && (
        <StepMediaLinks
          data={data}
          setData={setData}
          next={nextStep}
          prev={prevStep}
        />
      )}

      {step === 3 && (
        <StepMediaInfo
          data={data}
          setData={setData}
          submit={handleSubmit}
          prev={prevStep}
        />
      )}
    </div>
  );
}