import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";

function RecipeDetail() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    axios.get(`https://dummyjson.com/recipes/${id}`, { signal: controller.signal })
      .then(({ data }) => setRecipe(data))
      .catch((error) => { if (!axios.isCancel(error)) setErrorMsg("Could not load recipe details. Please try again."); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [id]);

  if (loading || (recipe && recipe.id !== Number(id))) return <main className="detail-shell" role="status"><div className="skeleton-image" style={{ borderRadius: 18, height: 340 }} /><p className="eyebrow" style={{ marginTop: 20 }}>Loading recipe…</p></main>;

  return (
    <main className="detail-shell">
      <Link to="/" className="back-link"><span aria-hidden="true">←</span> Back to recipes</Link>
      {errorMsg || !recipe ? <div className="error-state" role="alert"><h3>Recipe unavailable</h3><p>{errorMsg || "We couldn’t find that recipe."}</p><Link to="/" className="retry">Explore recipes</Link></div> : <>
        <section className="detail-hero">
          <img className="detail-image" src={recipe.image} alt={recipe.name ? `${recipe.name} recipe` : "Prepared meal"} />
          <div className="detail-info">
            <div className="recipe-meta"><span>{recipe.cuisine}</span><span className="dot" aria-hidden="true"/><span>{recipe.difficulty}</span></div>
            <h1>{recipe.name}</h1>
            <p>A delicious {recipe.cuisine?.toLowerCase()} recipe to bring something special to your table.</p>
            {recipe.rating != null && <p className="rating"><span aria-hidden="true">★</span> {recipe.rating}{recipe.reviewCount != null && ` · ${recipe.reviewCount} reviews`}</p>}
            <div className="detail-stats">
              {recipe.prepTimeMinutes != null && <div className="detail-stat"><strong>{recipe.prepTimeMinutes} min</strong><small>Prep time</small></div>}
              {recipe.cookTimeMinutes != null && <div className="detail-stat"><strong>{recipe.cookTimeMinutes} min</strong><small>Cook time</small></div>}
              {recipe.servings != null && <div className="detail-stat"><strong>{recipe.servings}</strong><small>Servings</small></div>}
              {recipe.caloriesPerServing != null && <div className="detail-stat"><strong>{recipe.caloriesPerServing}</strong><small>Cal / serving</small></div>}
            </div>
            {(recipe.mealType?.length > 0 || recipe.tags?.length > 0) && <p><strong>Good for:</strong> {[...(recipe.mealType || []), ...(recipe.tags || [])].join(" · ")}</p>}
          </div>
        </section>
        <section className="detail-columns">
          <div><h2>Ingredients</h2><ul>{recipe.ingredients?.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}</ul></div>
          <div><h2>Instructions</h2><ol>{recipe.instructions?.map((step, index) => <li key={`${index}-${step}`}>{step}</li>)}</ol></div>
        </section>
      </>}
    </main>
  );
}

export default RecipeDetail;
