// components/Footer.tsx
export default function Footer() {
  return (
    <footer className="sm:absolute left-1 bottom-1 p-1">
      <div className="mx-auto text-center text-white flex flex-col">
        <p className="w-max">
          Theme based on&nbsp;
          <a
            href="https://en.wikipedia.org/wiki/5_Centimeters_per_Second"
            target="_blank"
            rel="noopener noreferrer"
            className="text-pink-200 hover:underline"
          >
            5 Centimeters per Second
          </a>
        </p>
        <p className="w-max">
          Falling Sakura by&nbsp;
          <a
            href="https://codepen.io/rudtjd2548/pen/qBpVzxP"
            target="_blank"
            rel="noopener noreferrer"
            className="text-pink-200 hover:underline"
          >
            rudtjd2548
          </a>
        </p>
        <p className="w-max">
          Full website by&nbsp;
          <a
            href="https://github.com/Vergil1000x/Music_Player"
            target="_blank"
            rel="noopener noreferrer"
            className="text-pink-200 hover:underline"
          >
            Vergil1000
          </a>
        </p>
      </div>
    </footer>
  );
}
