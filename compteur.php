<?php
// Fichier où sera stocké le nombre de vues
$fichier = 'compteur.txt';

// Si le fichier n'existe pas, on le crée avec la valeur 0
if (!file_exists($fichier)) {
    file_put_contents($fichier, 0);
}

// Lecture du nombre actuel
$visites = (int) file_get_contents($fichier);

// Incrémentation
$visites++;

// Sauvegarde
file_put_contents($fichier, $visites);

// Affichage
echo $visites;
?>