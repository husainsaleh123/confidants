<form onSubmit={handleSubmit}>
        <div   className="input-container">

        <input
          type="search"
          placeholder="Search in Confidants…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search movies"
        
        />
        </div>
        <div>

        <button type="submit">Search</button>
        </div>
      </form>
