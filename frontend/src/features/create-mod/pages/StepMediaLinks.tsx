import Section from "@/shared/ui/section/Section";
import Input from "@/shared/ui/input/Input";
import Button from "@/shared/ui/button/Button";

import styles from "./StepMediaLinks.module.css";

type Props = {
  data: any;
  setData: (data: any) => void;

  next: () => void;
  prev: () => void;
};

export default function StepMediaLinks({
  data,
  setData,
  next,
  prev,
}: Props) {
  return (
    <Section
      title="Web & Metadata"
      description="Project links and visibility settings."
    >
      <div className={styles.layout}>
        <div className={styles.card}>
          <h3>Project Links</h3>

          <Input
            placeholder="Website URL"
            value={data.websiteUrl}
            onChange={(e) =>
              setData({
                ...data,
                websiteUrl: e.target.value,
              })
            }
          />

          <Input
            placeholder="Source URL"
            value={data.sourceUrl}
            onChange={(e) =>
              setData({
                ...data,
                sourceUrl: e.target.value,
              })
            }
          />

          <Input
            placeholder="Issues URL"
            value={data.issuesUrl}
            onChange={(e) =>
              setData({
                ...data,
                issuesUrl: e.target.value,
              })
            }
          />

          <Input
            placeholder="Discord URL"
            value={data.discordUrl}
            onChange={(e) =>
              setData({
                ...data,
                discordUrl: e.target.value,
              })
            }
          />

          <Input
            placeholder="Wiki URL"
            value={data.wikiUrl}
            onChange={(e) =>
              setData({
                ...data,
                wikiUrl: e.target.value,
              })
            }
          />

          <Input
            placeholder="Donation URL"
            value={data.donationUrl}
            onChange={(e) =>
              setData({
                ...data,
                donationUrl: e.target.value,
              })
            }
          />
        </div>

        <div className={styles.card}>
          <h3>Project Metadata</h3>

          <Input
            placeholder="License"
            value={data.license}
            onChange={(e) =>
              setData({
                ...data,
                license: e.target.value,
              })
            }
          />

          <select
            value={data.visibility}
            onChange={(e) =>
              setData({
                ...data,
                visibility: e.target.value,
              })
            }
          >
            <option value="PUBLIC">
              Public
            </option>

            <option value="UNLISTED">
              Unlisted
            </option>

            <option value="PRIVATE">
              Private
            </option>
          </select>
        </div>
      </div>

      <div className={styles.actions}>
        <Button
          variant="secondary"
          onClick={prev}
        >
          ← Back
        </Button>

        <Button onClick={next}>
          Continue →
        </Button>
      </div>
    </Section>
  );
}