export default function BlogPost({ title, content, date }) {
    return (
      <article className="bg-white p-4 rounded shadow my-4 max-w-xl mx-auto">
        <h2 className="text-xl font-bold mb-2">{title}</h2>
        <time className="text-gray-500 block mb-2">{date}</time>
        <p>{content}</p>
      </article>
    );
  }
  