const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});


app.get('/snippets', async (req, res) => {
    const { user_id } = req.query; 

    try {
        let query;
        let params;

        if (user_id) {
           
            query = 'SELECT * FROM snippets WHERE user_id = $1 ORDER BY created_at DESC';
            params = [user_id];
        } else {
            
            return res.json([]);
        }

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

app.post('/snippets', async (req, res) => {
    const { user_id, title, code_content, language, description, tags } = req.body;
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const snippetText = `
            INSERT INTO snippets (user_id, title, code_content, language, description)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, title, created_at;
        `;
        const snippetValues = [user_id, title, code_content, language, description];
        const snippetResult = await client.query(snippetText, snippetValues);
        const newSnippetId = snippetResult.rows[0].id;
        let newSnippet = snippetResult.rows[0];
        newSnippet.tags = [];

        if (tags && tags.length > 0) {
            for (const tagName of tags) {
                let tagId;
                const findTag = await client.query('SELECT id FROM tags WHERE name = $1', [tagName]);
                
                if (findTag.rows.length > 0) {
                    tagId = findTag.rows[0].id;
                } else {
                    const newTag = await client.query(
                        'INSERT INTO tags (name) VALUES ($1) RETURNING id', 
                        [tagName]
                    );
                    tagId = newTag.rows[0].id;
                }

                await client.query(
                    'INSERT INTO snippet_tags (snippet_id, tag_id) VALUES ($1, $2)',
                    [newSnippetId, tagId]
                );
                newSnippet.tags.push(tagName);
            }
        }
        
        newSnippet.code_content = code_content;
        newSnippet.language = language;
        newSnippet.description = description;

        await client.query('COMMIT');
        res.status(201).json(newSnippet);

    } catch (err) {
        await client.query('ROLLBACK');
        console.error("Transaction Error:", err.message);
        res.status(500).send('Server Error: ' + err.message);
    } finally {
        client.release();
    }
});

app.delete('/snippets/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM snippets WHERE id = $1 RETURNING *', [id]);
        
        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Snippet not found" });
        }
        
        res.json({ message: "Snippet deleted successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});