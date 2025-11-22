import tkinter as tk
from tkinter import ttk
from tkinter import messagebox
import mysql.connector
import subprocess

# Fonction pour connecter à la base de données
def connect_db():
    try:
        conn = mysql.connector.connect(
            host="localhost",
            user="root",
            password="",
            database="selmarin_create"
        )
        return conn
    except mysql.connector.Error as err:
        messagebox.showerror("Erreur de connexion", f"Erreur de connexion à la base de données: {err}")
        return None

# Fonction pour exécuter les scripts Python avec gestion des erreurs
def execute_script(script_name):
    try:
        result = subprocess.run(
            ["python", script_name], check=True, capture_output=True, text=True
        )
        print(f"{script_name} a été exécuté avec succès!\nSortie:\n{result.stdout}")
    except subprocess.CalledProcessError as e:
        messagebox.showerror(
            "Erreur",
            f"Erreur lors de l'exécution de {script_name}:\n{e.stderr}\nCode de retour: {e.returncode}"
        )

# Exécution des scripts avant de lancer l'interface Tkinter
execute_script("Q2 - selmarin_create.py")
execute_script("Q3 - selmarin_insert.py")

# Fonction pour vérifier les identifiants
def check_credentials(username, password):
    users = {
        "saunier": {"password": "saunier", "tables": ["saunier", "appartenir", "produit"]},
        "client": {"password": "client", "tables": ["produit", ]},
        "admin": {"password": "admin", "tables": ["saunier", "appartenir", "produit", "client", "concerner", "annee", "entree", "sortie"]},
        "garnier": {"password": "francois", "tables": ["saunier", "appartenir", "produit", "client", "concerner", "annee", "entree", "sortie"]},
    }

    user = users.get(username)
    if user and user["password"] == password:
        return user["tables"]
    else:
        return None

# Fonction pour afficher la fenêtre de connexion
def show_login():
    def login():
        username = username_entry.get()
        password = password_entry.get()
        
        # Vérifier les identifiants
        allowed_tables = check_credentials(username, password)
        
        if allowed_tables is not None:
            root.withdraw()  # Cacher la fenêtre de login
            show_main_app(allowed_tables)  # Afficher la fenêtre principale avec les tables autorisées
            login_window.withdraw()  # Cacher la fenêtre login
        else:
            messagebox.showerror("Erreur", "Identifiants incorrects!")

    # Créer une fenêtre de login
    login_window = tk.Toplevel(root)
    login_window.title("Connexion")
    login_window.geometry("300x220")
    
    tk.Label(login_window, text="Utilisateur", font=("Arial", 12)).pack(pady=10)
    username_entry = tk.Entry(login_window, font=("Arial", 12))
    username_entry.pack(pady=5)

    tk.Label(login_window, text="Mot de passe", font=("Arial", 12)).pack(pady=10)
    password_entry = tk.Entry(login_window, show="*", font=("Arial", 12))
    password_entry.pack(pady=5)

    login_button = ttk.Button(login_window, text="Se connecter", command=login)
    login_button.pack(pady=20)

# Fonction pour afficher l'application principale
def show_main_app(allowed_tables):
    # Fonction pour afficher les tables dans la base de données
    def load_tables():
        conn = connect_db()
        if conn:
            cursor = conn.cursor()
            cursor.execute("SHOW TABLES;")
            tables = cursor.fetchall()
            table_names = [table[0].upper() for table in tables if table[0] in allowed_tables]  # Tables en majuscules
            table_combobox['values'] = table_names
            cursor.close()
            conn.close()

    # Fonction pour afficher les données de la table sélectionnée
    def show_table_data(search_condition=""):
        table_name = table_combobox.get()
        if table_name:
            conn = connect_db()
            if conn:
                cursor = conn.cursor()
                query = f"SELECT * FROM {table_name} {search_condition};"
                try:
                    cursor.execute(query)
                    rows = cursor.fetchall()
                    # Vider l'arbre avant de le remplir avec de nouvelles données
                    for item in tree.get_children():
                        tree.delete(item)
                    
                    if rows:
                        # Remplir le tableau avec les nouvelles données
                        for row in rows:
                            tree.insert("", tk.END, values=row)
                        # Affichage du nombre de lignes et de colonnes
                        num_rows = len(rows)
                        num_columns = len(rows[0]) if rows else 0
                        row_col_label.config(text=f"Nombre de lignes: {num_rows}, Nombre de colonnes: {num_columns}")
                    else:
                        messagebox.showinfo("Aucune donnée", "Aucune donnée trouvée pour cette table.")
                except mysql.connector.Error as err:
                    messagebox.showerror("Erreur", f"Erreur lors de la récupération des données: {err}")
                finally:
                    cursor.close()
                    conn.close()

    # Fonction de recherche
    def search_data():
        search_term = search_entry.get()
        search_column = search_column_combobox.get()
        table_name = table_combobox.get()
        if table_name and search_term and search_column:
            search_condition = f"WHERE {search_column} LIKE '%{search_term}%'"
            show_table_data(search_condition)

    # Réinitialisation de la recherche quand la table change
    def reset_search():
        search_column_combobox.set('')
        search_entry.delete(0, tk.END)
        load_columns()

    # Fonction pour charger les colonnes d'une table dans le tableau
    def load_columns():
        table_name = table_combobox.get()
        conn = connect_db()
        if conn and table_name:
            cursor = conn.cursor()
            cursor.execute(f"DESCRIBE {table_name};")
            columns = cursor.fetchall()
            column_names = [col[0] for col in columns]
            # Définir les colonnes du Treeview
            tree["columns"] = column_names
            # Créer les en-têtes de colonnes
            for col in column_names:
                tree.heading(col, text=col)
                tree.column(col, width=100, anchor="center")
            cursor.close()
            conn.close()

            # Mettre à jour la liste déroulante des colonnes pour la recherche
            search_column_combobox['values'] = column_names
            if column_names:
                search_column_combobox.set(column_names[0])  # Sélectionner par défaut la première colonne

    # Fonction pour gérer la sélection de la table et charger ses données
    def on_table_select(event):
        reset_search()
        load_columns()  # Charger les colonnes de la table
        show_table_data()  # Afficher les données de la table sélectionnée

    # Fonction pour exécuter le script "Q4 - selmarin.py"
    def run_q4_script():
        execute_script("Q4 - selmarin2.py")
        messagebox.showinfo("Données bien insérées", "Données bien insérées à partir des CSV.")
        
    # Fonction pour exécuter le script "Q4 - selmarin.py"
    def run_q5_script():
        execute_script("Q5 - selmarin_requetes.py")
        messagebox.showinfo("Requêtes bien effectuées", "Requêtes effectuées avec succès.")
        
    def run_q6_script():
         execute_script("Q6 - selmarin_final.py")
         messagebox.showinfo("Exporter la base", "Export de la base réalisé avec succès.")

    # Création de la fenêtre principale
    root.deiconify()  # Afficher la fenêtre principale
    root.title("Gestion de la base de données - Sel Marin")
    root.geometry("900x600")
    root.config(bg="#00695C")  # Fond vert océan
    root.resizable(False, False)  # Désactiver le redimensionnement de la fenêtre

    # Style général
    style = ttk.Style()
    style.configure("TButton",
                    font=("Arial", 12, "bold"),
                    padding=10,
                    relief="flat",
                    background="#D4A373",  # Couleur sable
                    foreground="black")
    style.map("TButton",
              background=[('active', '#C67C40')])  # Un ton plus foncé quand le bouton est actif

    # Style des onglets
    style.configure("TNotebook.Tab",
                    font=("Arial", 12, "bold"),
                    background="#00695C",  # Vert océan
                    foreground="#00695C")  # Texte vert
    style.map("TNotebook.Tab", background=[('selected', '#1e5631')])  # Vert foncé quand sélectionné

    # Titre de l'application avec un style maritime
    title_label_style = {
        'font': ("Arial", 26, "bold"),
        'bg': "#00695C",  # Couleur verte
        'fg': "#FFFFFF"  # Texte blanc
    }

    title_label = tk.Label(root, text="Gestion de la base de données - Sel Marin", **title_label_style)
    title_label.pack(pady=20)

    # Création du notebook (onglets)
    notebook = ttk.Notebook(root)
    notebook.pack(fill=tk.BOTH, expand=True)

    # Onglet principal
    main_tab = ttk.Frame(notebook)
    notebook.add(main_tab, text="Base de données")

    # Onglet actions
    actions_tab = ttk.Frame(notebook)
    notebook.add(actions_tab, text="Actions")

    # Champ de recherche
    search_frame = tk.Frame(main_tab, bg="#00695C")
    search_frame.pack(pady=10, padx=20, fill=tk.X)

    search_label = tk.Label(search_frame, text="Rechercher :", font=("Arial", 12), bg="#00695C", fg="#FFFFFF")
    search_label.pack(side=tk.LEFT, padx=10)

    search_entry = tk.Entry(search_frame, font=("Arial", 12), width=25)
    search_entry.pack(side=tk.LEFT, padx=10)

    # Liste déroulante pour sélectionner la colonne à rechercher
    search_column_combobox = ttk.Combobox(search_frame, font=("Arial", 12), width=20, state="readonly")
    search_column_combobox.pack(side=tk.LEFT, padx=10)

    search_button = ttk.Button(search_frame, text="Rechercher", command=search_data)
    search_button.pack(side=tk.LEFT, padx=10)

    # Liste déroulante pour sélectionner la table
    table_combobox = ttk.Combobox(main_tab, state="readonly", font=("Arial", 12), width=25)
    table_combobox.pack(pady=20, padx=20, fill=tk.X)

    # Création d'un tableau avec un Treeview et une barre de défilement
    tree_frame = tk.Frame(main_tab)
    tree_frame.pack(pady=20, padx=20, fill=tk.BOTH, expand=True)

    tree_scrollbar = tk.Scrollbar(tree_frame, orient="vertical")
    tree_scrollbar.pack(side=tk.RIGHT, fill="y")

    tree = ttk.Treeview(tree_frame, show="headings", height=15, yscrollcommand=tree_scrollbar.set)
    tree.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)

    tree_scrollbar.config(command=tree.yview)

    # Label pour afficher le nombre de lignes et de colonnes
    row_col_label = tk.Label(main_tab, text="Nombre de lignes: 0, Nombre de colonnes: 0", font=("Arial", 12), bg="#00695C", fg="#FFFFFF")
    row_col_label.pack(pady=10)

    # Lier l'événement de sélection de la table
    table_combobox.bind("<<ComboboxSelected>>", on_table_select)

    # Charger les tables dans la liste déroulante dès le lancement de l'application
    load_tables()

    # Ajouter un bouton dans l'onglet "Actions"
    insert_button = ttk.Button(actions_tab, text="Insérer des données depuis les fichier CSV", command=run_q4_script)
    insert_button.pack(pady=20)
    
    # Ajouter un bouton dans l'onglet "Actions"
    insert_button = ttk.Button(actions_tab, text="Effectuer les 10 requêtes", command=run_q5_script)
    insert_button.pack(pady=20)
    
    # Ajouter un bouton dans l'onglet "Actions"
    insert_button = ttk.Button(actions_tab, text="Exporter la base", command=run_q6_script)
    insert_button.pack(pady=20)
   

# Lancer la fenêtre de login
root = tk.Tk()
root.withdraw()  # Cacher la fenêtre principale
show_login()
root.mainloop()
