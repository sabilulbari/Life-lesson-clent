import React from 'react';

const ExtraTwoSection = () => {
     const [topContributors, setTopContributors] = useState([]);
      const [mostSaved, setMostSaved] = useState([]);
      const [loading, setLoading] = useState(true);
    
    
    
      useEffect(() => {
        async function loadData() {
          try {
            const [featData, contribData, savedData] = await Promise.all([
              getTopContributors(),
              getMostSavedLessons()
            ]);
            setTopContributors(contribData || []);
            setMostSaved(savedData || []);
          } catch (error) {
            console.error("Failed to load home page data", error);
          } finally {
            setLoading(false);
          }
        }
        loadData();
      }, []);
    
      if (loading) {
        return (
          <div className="flex-grow flex items-center justify-center min-h-[60vh]">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-12 h-12 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />
              <span className="text-sm text-slate-400 font-medium">Gathering collective wisdom...</span>
            </div>
          </div>
        );
      }
    return (
      <div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side: Top Contributors */}
          <section className="space-y-4 glass p-6 rounded-2xl border border-[var(--card-border)]">
            <h2 className="text-xl font-extrabold tracking-tight text-gradient flex items-center gap-1.5">
              <Award size={20} className="text-indigo-400" /> Top Contributors this Week
            </h2>
            <p className="text-xs text-slate-400 mb-4">Users sharing the most lessons over the last 7 days.</p>

            {topContributors.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">Be the first contributor this week!</p>
            ) : (
              <div className="divide-y divide-slate-800/30">
                {topContributors.map((contrib, index) => (
                  <div key={contrib._id} className="flex items-center justify-between py-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 text-xs font-bold text-indigo-400">#{index + 1}</div>
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-indigo-500 flex items-center justify-center text-white font-bold text-xs">
                        {contrib.photo ? <img src={contrib.photo} alt={contrib.name} className="w-full h-full object-cover" /> : contrib.name?.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-semibold">{contrib.name}</span>
                    </div>
                    <span className="text-xs bg-indigo-500/10 text-indigo-300 px-2 py-0.5 rounded-full font-bold">
                      {contrib.lessonCount} {contrib.lessonCount === 1 ? "lesson" : "lessons"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Right Side: Most Saved Lessons */}
          <section className="space-y-4 glass p-6 rounded-2xl border border-[var(--card-border)]">
            <h2 className="text-xl font-extrabold tracking-tight text-gradient flex items-center gap-1.5">
              <Bookmark size={18} className="text-cyan-400" /> Most Saved Lessons
            </h2>
            <p className="text-xs text-slate-400 mb-4">Lessons with the highest saves count from the community.</p>

            {mostSaved.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No favorited lessons yet.</p>
            ) : (
              <div className="divide-y divide-slate-800/30">
                {mostSaved.map((lesson) => (
                  <Link
                    key={lesson._id}
                    href={`/lessons/${lesson._id}`}
                    className="flex items-center justify-between py-3 hover:bg-slate-800/20 px-2 rounded-lg transition-colors group"
                  >
                    <div className="flex items-center space-x-3 overflow-hidden mr-2">
                      <span className="text-xs font-medium text-slate-500 uppercase shrink-0 w-16 truncate">{lesson.category}</span>
                      <span className="text-sm font-semibold truncate group-hover:text-indigo-400 transition-colors">{lesson.title}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-xs text-slate-400 shrink-0">
                      <Bookmark size={12} className="text-cyan-400" />
                      <span>{lesson.favoritesCount}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    );
};

export default ExtraTwoSection;