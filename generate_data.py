import json
from database import db
from models import User, Coachingconnection
from igraph import Graph

def generate_graph(nodes, edges):
    g = Graph.Erdos_Renyi(n=nodes, m=edges)
    edge_list = g.get_edgelist()

    for _ in range(nodes):
        newuser = User()
        db.add(newuser)

    users = db.query(User).all()

    for (source, target) in edge_list:
        connection = Coachingconnection()
        db.add(connection)
        users[source].students.append(connection)
        users[target].coaches.append(connection)

    db.commit()

def get_links():
    # d3 links are zero-indexed but SQLite starts at 1,
    # so we can either tell the db to start indexing at 0 (http://stackoverflow.com/q/692856)
    # or search for nodes by ID in d3 (http://stackoverflow.com/q/23986466)
    # or just subtract 1 from ID here to generate the proper values in our controlled environment.
    # This wouldn't work if you're also deleting nodes, but it works fine as a controlled data-generating hack.
    return [{'source': c.coach_id-1, 'target': c.student_id-1} for c in db.query(Coachingconnection).all()]

def get_nodes():
    return [{'id': user.id-1} for user in db.query(User).all()]

def write_links(filename):  
    with open(filename, 'w') as outfile:
        links = get_links()
        nodes = get_nodes()
        json.dump({'links': links, 'nodes': nodes}, outfile)

if __name__ == '__main__':
    generate_graph(200, 50)
    write_links('graph.json')