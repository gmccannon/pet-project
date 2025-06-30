import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-white p-4 text-black">
      <ul className="flex justify-around">
        <li>
          <Link href="/search/animal">Search Animals</Link>
        </li>
        <li>
          <Link href="/add/animal">Add Animal</Link>
        </li>
        <li>
          <Link href="/edit/animal">Edit Animal</Link>
        </li>
        <li>
          <Link href="/remove/animal">Remove Animal</Link>
        </li>
      </ul>
    </nav>
  );
}
