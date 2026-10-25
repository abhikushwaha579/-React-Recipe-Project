import { Link } from "react-router";

function RecipeCard({ recipe }) {
  const totalTime = (recipe.prepTimeMinutes || 0) + (recipe.cookTimeMinutes || 0);
  return (
    <article className="recipe-card">
      <Link to={`/recipe/${recipe.id}`} aria-label={`View ${recipe.name}`}>
        <div className="recipe-image-wrap">
          <img src={recipe.image} alt={recipe.name ? `${recipe.name} recipe` : "Prepared meal"} className="recipe-image" loading="lazy" />
        </div>
      </Link>
      <div className="recipe-body">
        <div className="recipe-meta">
          {recipe.cuisine && <span>{recipe.cuisine}</span>}
          {recipe.cuisine && recipe.difficulty && <span className="dot" aria-hidden="true" />}
          {recipe.difficulty && <span>{recipe.difficulty}</span>}
        </div>
        <h3 className="recipe-title"><Link to={`/recipe/${recipe.id}`}>{recipe.name}</Link></h3>
        <div className="recipe-footer">
          <span className="rating" aria-label={recipe.rating ? `${recipe.rating} out of 5 stars` : undefined}>
            {recipe.rating != null && <><span aria-hidden="true">★</span> {recipe.rating}</>}
          </span>
          {totalTime > 0 && <span><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>{totalTime} min</span>}
          <Link to={`/recipe/${recipe.id}`} className="view-link">View recipe <span aria-hidden="true">→</span></Link>
        </div>
      </div>
    </article>
  );
}

export default RecipeCard;
