# Infection
## Visualization
The visualization can be seen [here](https://rasmi.github.io/infection/). The static files used for the visualization can be seen on the [`gh-pages` branch](https://github.com/rasmi/infection/tree/gh-pages).

## Development
This test data was generated with Python 2.7.10. Use virtualenv as follows:
```
virtualenv pythonenv
source pythonenv/bin/activate
```

Then, install required packages (SQLAlchemy for the database and igraph for random graph generation):
```
pip install -r requirements.txt
```

Then, run the data generation script:
```
python generate_data.py
```

This will create `users.db`, a SQLite database containing users and their connections, and `graph.json`, a json blob with nodes and links ready to be visualized in d3.
