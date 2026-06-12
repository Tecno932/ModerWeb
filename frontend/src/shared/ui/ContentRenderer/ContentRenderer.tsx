import styles from "./index.module.css";

type Props = {
  content: any;
};

function renderTextNode(
  node: any,
  key: number
) {
  let element: React.ReactNode =
    node.text || "";

  if (node.marks) {
    node.marks.forEach(
      (mark: any) => {
        switch (mark.type) {
          case "bold":
            element = (
              <strong>
                {element}
              </strong>
            );
            break;

          case "italic":
            element = (
              <em>{element}</em>
            );
            break;

          case "underline":
            element = (
              <u>{element}</u>
            );
            break;

          case "strike":
            element = (
              <s>{element}</s>
            );
            break;

          case "textStyle":
            element = (
              <span
                style={{
                  color:
                    mark.attrs
                      ?.color,
                }}
              >
                {element}
              </span>
            );
            break;

          case "highlight":
            element = (
              <mark
                style={{
                  background:
                    mark.attrs
                      ?.color,
                }}
              >
                {element}
              </mark>
            );
            break;
        }
      }
    );
  }

  return (
    <span key={key}>
      {element}
    </span>
  );
}

function renderInline(
  content: any[]
) {
  if (!content) return null;

  return content.map(
    (
      node: any,
      index: number
    ) =>
      renderTextNode(
        node,
        index
      )
  );
}

export default function ContentRenderer({
  content,
}: Props) {
  if (!content?.content) {
    return null;
  }

  return (
    <div className={styles.content}>
      {content.content.map(
        (
          block: any,
          index: number
        ) => {
          switch (
            block.type
          ) {
            case "heading": {
              const level =
                block.attrs
                  ?.level || 1;

              const text =
                renderInline(
                  block.content
                );

              if (
                level === 1
              ) {
                return (
                  <h1
                    key={index}
                  >
                    {text}
                  </h1>
                );
              }

              if (
                level === 2
              ) {
                return (
                  <h2
                    key={index}
                  >
                    {text}
                  </h2>
                );
              }

              return (
                <h3
                  key={index}
                >
                  {text}
                </h3>
              );
            }

            case "paragraph":
              return (
                <p key={index}>
                  {renderInline(
                    block.content
                  )}
                </p>
              );

            case "quote":
              return (
                <blockquote
                  key={index}
                >
                  {renderInline(
                    block.content
                  )}
                </blockquote>
              );

            case "image":
              return (
                <img
                  key={index}
                  src={
                    block
                      .attrs
                      ?.src
                  }
                  alt={
                    block
                      .attrs
                      ?.alt ||
                    ""
                  }
                />
              );

            case "bulletList":
              return (
                <ul
                  key={index}
                >
                  {block.content?.map(
                    (
                      item: any,
                      i: number
                    ) => (
                      <li
                        key={i}
                      >
                        {renderInline(
                          item
                            .content?.[0]
                            ?.content
                        )}
                      </li>
                    )
                  )}
                </ul>
              );

            case "orderedList":
              return (
                <ol
                  key={index}
                >
                  {block.content?.map(
                    (
                      item: any,
                      i: number
                    ) => (
                      <li
                        key={i}
                      >
                        {renderInline(
                          item
                            .content?.[0]
                            ?.content
                        )}
                      </li>
                    )
                  )}
                </ol>
              );

            case "codeBlock":
              return (
                <pre
                  key={index}
                  className={
                    styles.code
                  }
                >
                  <code>
                    {block.content?.[0]
                      ?.text ||
                      ""}
                  </code>
                </pre>
              );

            case "divider":
              return (
                <hr
                  key={index}
                />
              );

            default:
              return (
                <div
                  key={index}
                  className={
                    styles.unsupported
                  }
                >
                  Unsupported:
                  {" "}
                  {block.type}
                </div>
              );
          }
        }
      )}
    </div>
  );
}