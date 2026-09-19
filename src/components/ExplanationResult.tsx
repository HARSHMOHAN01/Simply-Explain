
import ListenButton from './ListenButton';
import type { ExplanationResult as ExtractedResult } from '../services/gemini';

interface ExplanationResultProps {
  result: ExtractedResult;
  language: string;
}

export default function ExplanationResult({ result, language }: ExplanationResultProps) {
  const fullTextToRead = `
    ${result.summary}
    ${result.actions?.length > 0 ? '. What you need to do: ' + result.actions.join('. ') : ''}
    ${result.important ? '. Important: ' + result.important : ''}
  `;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-4xl font-extrabold mb-2">Here's what it means</h2>
        <p className="text-xl text-gray-600 bg-gray-100 w-fit px-4 py-2 rounded-lg font-medium">
          Explained in {language}
        </p>
      </div>

      <div className="my-2">
        <ListenButton textToRead={fullTextToRead} language={language} />
      </div>

      <div className="flex flex-col gap-8">
        <section className="bg-white border-4 border-gray-100 p-6 md:p-8 rounded-2xl shadow-sm">
          <h3 className="text-2xl font-bold flex items-center gap-3 mb-4 text-black">
            <span aria-hidden="true" className="text-3xl">🧠</span> आसान भाषा में (Simple Explanation)
          </h3>
          <p className="text-2xl leading-relaxed font-medium">
            {result.summary}
          </p>
        </section>

        {result.actions && result.actions.length > 0 && (
          <section className="bg-blue-50 border-4 border-blue-100 p-6 md:p-8 rounded-2xl shadow-sm">
            <h3 className="text-2xl font-bold flex items-center gap-3 mb-4 text-blue-900">
              <span aria-hidden="true" className="text-3xl">📌</span> आपको क्या करना है (Actions)
            </h3>
            <ul className="flex flex-col gap-4">
              {result.actions.map((action, index) => (
                <li key={index} className="text-2xl leading-relaxed flex gap-4 text-blue-900 font-medium">
                  <span className="font-bold min-w-[1.5rem]">{index + 1}.</span>
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {result.important && (
          <section className="bg-red-50 border-4 border-red-100 p-6 md:p-8 rounded-2xl shadow-sm">
            <h3 className="text-2xl font-bold flex items-center gap-3 mb-4 text-red-900">
              <span aria-hidden="true" className="text-3xl">⚠️</span> ध्यान दें (Important)
            </h3>
            <p className="text-2xl leading-relaxed text-red-900 font-medium">
              {result.important}
            </p>
          </section>
        )}
      </div>
    </div>
  );
}
