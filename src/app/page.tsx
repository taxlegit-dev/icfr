export default function Home() {
  return (
    <div className=" text-black flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-8">Welcome to ICFR</h1>
        <div className="space-x-4">
          <a
            href="/signup"
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Signup
          </a>
          <a
            href="/login"
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
          >
            Login
          </a>
        </div>
      </div>
    </div>
  );
}
