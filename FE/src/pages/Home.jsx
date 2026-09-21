import { useState } from 'react';
import NoteBoard from '../components/NoteBoard';

const API_URL = 'http://localhost:3000/api/notes';

const TOPICS = [
  { slug: 'hoc-tap', label: 'Học tập' },
  { slug: 'cong-viec', label: 'Công việc' },
  { slug: 'ca-nhan', label: 'Cá nhân' },
];

function Home() {
  const [topic, setTopic] = useState(TOPICS[0].slug);

  return (
    <div>
      <h2 className="mb-4 text-xl font-semibold sm:mb-5 sm:text-2xl">Danh sách ghi chú</h2>

      <div className="mb-6 flex gap-2 sm:flex-wrap">
        {TOPICS.map((item) => (
          <button
            key={item.slug}
            onClick={() => setTopic(item.slug)}
            className={`flex-1 whitespace-nowrap rounded-md border px-4 py-2 text-sm transition sm:flex-none ${
              topic === item.slug
                ? 'border-honey bg-honey text-gray-900'
                : 'border-gray-200 bg-white text-gray-700 hover:bg-honey/15 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <NoteBoard key={topic} baseUrl={`${API_URL}/${topic}`} />
    </div>
  );
}

export default Home;
