import axios from "axios";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import RecipeCard from "../components/RecipeCard";

const categories = ["All Recipes", "Breakfast", "Lunch", "Dinner", "Dessert", "Vegetarian"];

function RecipeSkeletons() {
  return <div className="recipe-grid" aria-label="Loading recipes" aria-busy="true">{Array.from({ length: 6 }, (_, i) => <div className="skeleton" key={i}><div className="skeleton-image"/><div className="skeleton-content"><div className="skeleton-line short"/><div className="skeleton-line"/><div className="skeleton-line"/></div></div>)}</div>;
}

function Home() {
  const [recipes, setRecipes] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [input, setInput] = useState("");
  const [category, setCategory] = useState("All Recipes");
  const requestRef = useRef(0);

  const fetchRecipes = useCallback(async (skipCount = 0, query = "") => {
    const requestId = ++requestRef.current;
    setLoading(true);
    setErrorMsg("");
    try {
      const base = query ? "https://dummyjson.com/recipes/search" : "https://dummyjson.com/recipes";
      const { data } = await axios.get(base, { params: { limit: 50, skip: skipCount, ...(query ? { q: query } : {}) } });
      if (requestId !== requestRef.current) return;
      setRecipes((prev) => skipCount === 0 ? data.recipes : [...prev, ...data.recipes]);
      setTotal(data.total);
    } catch {
      if (requestId === requestRef.current) setErrorMsg("We couldn’t load the recipes right now. Please check your connection and try again.");
    } finally {
      if (requestId === requestRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => fetchRecipes(), 0);
    return () => window.clearTimeout(timer);
  }, [fetchRecipes]);

  const visibleRecipes = useMemo(() => {
    if (category === "All Recipes") return recipes;
    const key = category.toLowerCase();
    return recipes.filter((recipe) => {
      const mealTypes = (recipe.mealType || []).map((type) => type.toLowerCase());
      const tags = (recipe.tags || []).map((tag) => tag.toLowerCase());
      if (key === "vegetarian") return tags.some((tag) => tag.includes("vegetarian")) || mealTypes.includes("vegetarian");
      return mealTypes.includes(key) || tags.includes(key);
    });
  }, [category, recipes]);

  function handleSearch(event) {
    event.preventDefault();
    const query = input.trim();
    setSearchQuery(query);
    setCategory("All Recipes");
    fetchRecipes(0, query);
  }

  function chooseSuggestion(value) {
    setInput(value);
    setSearchQuery(value);
    setCategory("All Recipes");
    fetchRecipes(0, value);
  }

  return (
    <>
      <main className="page-shell">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-content">
            <span className="eyebrow">Good food, made joyful</span>
            <h1 id="hero-title">Discover Your Next Favorite Meal</h1>
            <p>Explore delicious recipes, discover new flavors, and find something wonderful to cook.</p>
            <form className="search-form" onSubmit={handleSearch} role="search">
              <label className="sr-only" htmlFor="recipe-search">Search recipes</label>
              <input id="recipe-search" type="search" value={input} onChange={(event) => setInput(event.target.value)} placeholder="What are you craving?" />
              <button className="search-button" type="submit" aria-label="Search recipes">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>Search
              </button>
            </form>
            <div className="popular"><span>Popular:</span>{["Pizza", "Pasta", "Chicken", "Dessert"].map((item) => <button type="button" key={item} onClick={() => chooseSuggestion(item)}>{item}</button>)}</div>
          </div>
        </section>

        <section id="recipes" aria-labelledby="recipes-title">
          <div className="section-heading"><div><span className="eyebrow">Find your inspiration</span><h2 id="recipes-title">Explore recipes</h2></div><p>{searchQuery ? `Results for “${searchQuery}”` : `${total || recipes.length} ideas for your next meal`}</p></div>
          <div className="category-list" aria-label="Filter recipes by category">
            {categories.map((item) => <button key={item} type="button" className="category-chip" aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}
          </div>

          {errorMsg ? <div className="error-state" role="alert"><span aria-hidden="true">⚠</span><h3>Something went wrong</h3><p>{errorMsg}</p><button className="retry" type="button" onClick={() => fetchRecipes(0, searchQuery)}>Try again</button></div>
            : loading && recipes.length === 0 ? <RecipeSkeletons />
            : visibleRecipes.length === 0 && !loading ? <div className="empty-state"><span aria-hidden="true">🍽️</span><h3>No recipes found</h3><p>{category !== "All Recipes" ? `We couldn’t find recipes in ${category}. Try another category.` : `We couldn’t find recipes for “${searchQuery}”. Try another search.`}</p></div>
            : <>
              {loading && <p role="status" className="eyebrow" style={{ marginBottom: 12 }}>Updating recipes…</p>}
              <div className="recipe-grid">{visibleRecipes.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} />)}</div>
            </>}
          {!loading && !errorMsg && category === "All Recipes" && recipes.length < total && <button type="button" className="load-more" onClick={() => fetchRecipes(recipes.length, searchQuery)}>Load more recipes</button>}
        </section>
      </main>
      <footer className="site-footer">Made for curious cooks · RecipeFinder</footer>
    </>
  );
}

export default Home;
