#Code Théo PETIT - Gabriel SAGOT

#-----------------------------------------------------------------------------------------#
#Répertoire

#-----------------------------------------------------------------------------------------#
setwd("C:/Users/tpetit07.PEDA/OneDrive - Université de Poitiers/IUT poitiers/IBAZIZOU/SAE Estimation par echantillonage")

#-----------------------------------------------------------------------------------------#
# ouverture fichier CSV
#-----------------------------------------------------------------------------------------#
table <- read.csv("population_francaise_communes.csv",
                  sep=';',fileEncoding = "Latin1",header=TRUE)


table$Population.totale <- gsub(" ","",table$Population.totale)
table$Population.totale <- as.numeric(table$Population.totale)


 


#-----------------------------------------------------------------------------------------#
#-----------------------------------------------------------------------------------------#
# Partie 1.1 : échantillonnage aléatoire simple
#-----------------------------------------------------------------------------------------#
#-----------------------------------------------------------------------------------------#


# question 1
#-----------#
donnees <- table[table$Nom.de.la.région == "Île-de-France", c("Code.département","Commune","Population.totale")]
donnees<- unique(donnees)
head(donnees)

# question 2
#-----------#
U <- donnees$Commune
head(U)
N = length(U)
N

# question 3
#-----------#
T<-sum(donnees$Population.totale)


# question 4 
#-----------#
n=100
E=sample(U, n,replace=FALSE)
head(E)

# question 5
#-----------#
donnees1= donnees[donnees$Commune %in% E, ]
head(donnees1)

# question 6 (moyenne de l'échantillon)
#--------------------------------------#
moy= mean(donnees1$Population.totale)
moy
# idc de mu
idcmoy = t.test(donnees1$Population.totale)$conf.int
idcmoy

# question 7 (Nbre d'habitants total estimé)
#-------------------------------------------#
Test = N*moy
Test
# IDC de T 
idcT = idcmoy*N
idcT
#Marge d'erreur 
marge=(idcT[2]-idcT[1])/2
marge

# question 8 (initialisation du data frame final à exporté)
#----------------------------------------------------------#
Tableau_simple <- data.frame(Population_totale = numeric(15),
                             population_estime = numeric(15),
                             idc_inf = numeric(15),
                             idc_sup = numeric(15),
                             marge_derreur = numeric(15))

# boucle pour répéter les 3 dernières étapes
for (i in 1:15) {
  E=sample(U,size=n, replace=FALSE)
  donnees1 <- donnees[donnees$Commune %in% E, ]
  
  # Ajout d'impressions pour le débogage
  print(paste("Groupe", i))
  print(donnees1)
  
  # Vérifier si le nombre d'observations est suffisant pour effectuer un test T
  if (nrow(donnees1) >= 2) {
    moy <- mean(donnees1$Population.totale)
    idcmoy <- t.test(donnees1$Population.totale)$conf.int
    Test <- N * moy
    idcT <- idcmoy * N
    marge <- (idcT[2] - idcT[1]) / 2
    
    # Stocker les résultats dans le tableau final
    Tableau_simple[i, "Population_totale"] <- sum(donnees$Population.totale)
    Tableau_simple[i, "population_estime"] <- Test
    Tableau_simple[i, "idc_inf"] <- idcT[1]
    Tableau_simple[i, "idc_sup"] <- idcT[2]
    Tableau_simple[i, "marge_derreur"] <- marge
  } 
}


# Mise en forme du fichier .xlsx
#--------------------------------#

# Installer le package si nécessaire
if (!require(openxlsx)) install.packages("openxlsx")
library(openxlsx)

# Formater les colonnes numériques avec des séparateurs de milliers et arrondir
Tableau_formate <- Tableau_simple
Tableau_formate[] <- lapply(Tableau_formate, function(x) {
  if (is.numeric(x)) format(round(x, 2), big.mark = " ", decimal.mark = ",") else x
})

# Créer un nouveau classeur Excel
wb <- createWorkbook()
addWorksheet(wb, "Résultats")

# Titre centré au-dessus du tableau
writeData(wb, "Résultats", "Tableau des estimations de population", startRow = 1, startCol = 1)
mergeCells(wb, "Résultats", cols = 1:ncol(Tableau_formate), rows = 1)
addStyle(wb, "Résultats", style = createStyle(fontSize = 14, textDecoration = "bold", halign = "center"), 
         rows = 1, cols = 1)

# Écrire les données à partir de la ligne 3
writeData(wb, "Résultats", Tableau_formate, startRow = 3, withFilter = TRUE)

# Style pour l'en-tête
style_entete <- createStyle(
  textDecoration = "bold",
  border = "Bottom",
  halign = "center",
  fgFill = "#D9E1F2"
)
addStyle(wb, sheet = 1, style = style_entete, rows = 3, cols = 1:ncol(Tableau_formate), gridExpand = TRUE)

# Ajuster la largeur des colonnes automatiquement
setColWidths(wb, sheet = 1, cols = 1:ncol(Tableau_formate), widths = "auto")


# Création et insertion du graphique
#--------------------------------#

# Charger ggplot2 si nécessaire
if (!require(ggplot2)) install.packages("ggplot2")
library(ggplot2)

# Créer et sauvegarder le graphique
png("graph_population.png", width = 800, height = 500)
ggplot(Tableau_simple, aes(x = 1:nrow(Tableau_simple), y = population_estime)) +
  geom_line(color = "#1F497D", size = 1) +
  geom_ribbon(aes(ymin = idc_inf, ymax = idc_sup), alpha = 0.2, fill = "#1F497D") +
  labs(title = "Estimation de la population totale par itération",
       x = "Itération", y = "Population estimée") +
  theme_minimal()
dev.off()

# Insérer le graphique dans l'Excel (sous le tableau)
insertImage(wb, sheet = "Résultats", 
            file = "graph_population.png", 
            startRow = nrow(Tableau_formate) + 6, 
            startCol = 1, width = 6, height = 5, units = "in")


# Exportation du fichier .xlsx
#--------------------------------#
saveWorkbook(wb, "Tableau_simple.xlsx", overwrite = TRUE)




#-----------------------------------------------------------------------------------------#
#-----------------------------------------------------------------------------------------#
# Partie 1.2 : Partie stratifiée
#-----------------------------------------------------------------------------------------#
#-----------------------------------------------------------------------------------------#


# Question 1 (quartiles)
#----------------------#
summary(donnees$Population.totale)

# Question 2 (strates)
#----------------------#
datastrat=donnees
datastrat$Strate=cut(datastrat$Population.totale, breaks=c(0,569, 1444, 7367, 1000000), labels=c(1,2,3,4))
head(datastrat)
table(datastrat)



# Question 3 : Effectif des strates
#----------------------------------#

# Charger le package
if (!require(sampling)) install.packages("sampling")
library(sampling)

# Trier les données par strate
data <- datastrat[order(datastrat$Strate), ]

# Taille totale de la population
N <- nrow(datastrat)

# Effectifs de chaque strate
Nh <- table(datastrat$Strate)

# Définir nh = 25 pour chaque strate
n <- 100
nh <- rep(25, length(Nh))  
names(nh) <- names(Nh)     

# Sondage stratifié sans remise
st <- strata(datastrat, stratanames = c("Strate"), size = nh, method = "srswor")

# Obtenir les données échantillonnées
data1 <- getdata(datastrat, st)
data1 <- data1[order(data1$Strate), ]

# Poids des strates (gh)
gh <- Nh / N

# Taux de sondage dans les strates (fh)
fh <- nh / as.numeric(Nh)

# Affichage
print("Effectifs de chaque strate (Nh) :")
print(Nh)

print("Taille des échantillons par strate (nh) :")
print(nh)

print("Poids des strates (gh) :")
print(round(gh, 4))

print("Taux de sondage par strate (fh) :")
print(round(fh, 4))



# Question 4
#------------#
# Mise en place des 4 échantillons
ech1=data1[data1$Strate==1, ]
ech2=data1[data1$Strate==2, ]
ech3=data1[data1$Strate==3, ]
ech4=data1[data1$Strate==4, ]

# Moyennes des 4 échantillons
m1=mean(ech1$Population.totale)
m2=mean(ech2$Population.totale)
m3=mean(ech3$Population.totale)
m4=mean(ech4$Population.totale)

# Variances des 4 échantillons
var1=var(ech1$Population.totale)
var2=var(ech2$Population.totale)
var3=var(ech3$Population.totale)
var4=var(ech4$Population.totale)


# Question 5
#------------#
# Moyenne générale (des 3 échantillons réunis)
Xbarst= (Nh[1]*m1 + Nh[2]*m2 + Nh[3]*m3 + Nh[4]*m4)/N

# Estimation de la variance de Xbarst
varXbarst= ((gh[1])^2)*(1-fh[1])*var1/(nh[1]) + ((gh[2])^2)*(1-fh[2])*var2/(nh[2]) +
  ((gh[3])^2)*(1-fh[3])*var3/(nh[3]) + ((gh[4])^2)*(1-fh[4])*var4/(nh[4])

# IDC pour mu Ã  95%
alpha=0.05
binf = Xbarst - qnorm(1-alpha/2)*sqrt(varXbarst)
bsup = Xbarst + qnorm(1-alpha/2)*sqrt(varXbarst)
idcmoy=c(binf, bsup)


# Question 6  
#------------#
# Estimation du total T
Tstr= N*Xbarst
Tstr

# Estimation par IDC du total T
binf = idcmoy[1]*N
bsup= idcmoy[2]*N
idcT=c(binf, bsup)
idcT

# Marge d'erreur
marge=(idcT[2]-idcT[1])/2
marge


# Question 7
#------------#
Tableau_strate <- data.frame(Population_totale = numeric(15),
                             population_estime = numeric(15),
                             idc_inf = numeric(15),
                             idc_sup = numeric(15),
                             marge_derreur = numeric(15))

for (i in 1:15) {
  st = strata(datastrat, stratanames = c("Strate"), size = nh, method = "srswr")
  data1=getdata(datastrat, st)
  
  # Ajout d'impressions pour le débogage
  print(paste("Groupe", i))
  print(data1)
  
  # Vérifier si le nombre d'observations est suffisant pour effectuer un test t
  if (nrow(data1) >= 2) {
    st = strata(datastrat, stratanames = c("Strate"), size = nh, method = "srswr")
    data1=getdata(datastrat, st)
    data1 = data1[order(data1$Strate), ]
    Nh=table(data$Strate)
    gh=Nh/N
    fh=nh/Nh
    ech1=data1[data1$Strate==1, ]
    ech2=data1[data1$Strate==2, ]
    ech3=data1[data1$Strate==3, ]
    ech4=data1[data1$Strate==4, ]
    m1=mean(ech1$Population.totale)
    m2=mean(ech2$Population.totale)
    m3=mean(ech3$Population.totale)
    m4=mean(ech4$Population.totale)
    var1=var(ech1$Population.totale)
    var2=var(ech2$Population.totale)
    var3=var(ech3$Population.totale)
    var4=var(ech4$Population.totale)
    Xbarst= (Nh[1]*m1 + Nh[2]*m2 + Nh[3]*m3 + Nh[4]*m4)/N
    varXbarst= ((gh[1])^2)*(1-fh[1])*var1/(nh[1]) + ((gh[2])^2)*(1-fh[2])*var2/(nh[2]) +
      ((gh[3])^2)*(1-fh[3])*var3/(nh[3]) + ((gh[4])^2)*(1-fh[4])*var4/(nh[4])
    binf = Xbarst - qnorm(1-alpha/2)*sqrt(varXbarst)
    bsup = Xbarst + qnorm(1-alpha/2)*sqrt(varXbarst)
    idcmoy=c(binf, bsup)
    Tstr= N*Xbarst
    binf = idcmoy[1]*N
    bsup= idcmoy[2]*N
    idcT=c(binf, bsup)
    marge=(idcT[2]-idcT[1])/2
    
    # Stocker les résultats dans le tableau
    Tableau_strate[i, "Population_totale"] <- sum(donnees$Population.totale)
    Tableau_strate[i, "population_estime"] <- Tstr
    Tableau_strate[i, "idc_inf"] <- idcT[1]
    Tableau_strate[i, "idc_sup"] <- idcT[2]
    Tableau_strate[i, "marge_derreur"] <- marge
  } 
}

# Export du fichier CSV
write.csv2(Tableau_strate, file = "Tableau_strate.csv", row.names = FALSE)



#-----------------------------------------------------------------------------------------#
#-----------------------------------------------------------------------------------------#
# Partie 2 : Traitement de données 
#-----------------------------------------------------------------------------------------#
#-----------------------------------------------------------------------------------------#




# Question 2 (Ouverture de la table sports)
#------------------------------------------#
sport <- read.csv("EnqueteSportEtudiant2024.csv",
                    sep=';',fileEncoding = "Latin1",header=TRUE)

# Question 3 
#-----------#
head(sport)


# Question 4 ( sport - fumeur) 
#------------------------------#

# Construction des tableaux croisés
sport$fumeur_statut <- ifelse(sport$fumer == 'Oui', 'Fumeur', 'Non fumeur')
sport$sportif_statut <- ifelse(sport$sport == 'Oui', 'Sportif', 'Non sportif')
sport$alimentation_statut <- ifelse(sport$alimentation == 'Oui', 'Bonne alimentation', 'Mauvaise alimentation ')
sport$sante_statut <- ifelse(sport$sante == 'Oui', 'Bonne santé', 'Mauvaise santé ')


tableau_croise_sport <- table(sport$sportif_statut, sport$fumeur_statut)
print(tableau_croise_sport)
tableau_croise_pourcent <- prop.table(tableau_croise_sport) * 100
print(round(tableau_croise_pourcent, 2))  # arrondi à 2 décimales


tableau_croise_sport2 <- table(sport$sportif_statut, sport$alimentation_statut)
print(tableau_croise_sport2)
tableau_croise_pourcent2 <- prop.table(tableau_croise_sport2) * 100
print(round(tableau_croise_pourcent2, 2))  # arrondi à 2 décimales


tableau_croise_sport3 <- table(sport$sportif_statut, sport$sante_statut)
print(tableau_croise_sport3)
tableau_croise_pourcent3 <- prop.table(tableau_croise_sport3) * 100
print(round(tableau_croise_pourcent3, 2))  # arrondi à 2 décimales




# test du khi-deux
Fumeur=chisq.test(tableau_croise_sport)
Fumeur
Alimentation=chisq.test(tableau_croise_sport2)
Sante=chisq.test(tableau_croise_sport3)



# Extraire les résultats des tests khi²
khi2 <- c(Fumeur$statistic, Alimentation$statistic, Sante$statistic)
pvaleur <- c(Fumeur$p.value, Alimentation$p.value, Sante$p.value)

# Créer un data frame récapitulatif
tab_khi2 <- data.frame(
  variables_quali = c("Fumeur", "Alimentation", "Santé"),
  khi2 = khi2,
  pvaleur = pvaleur
)

# Exporter le tableau des résultats des tests khi²
write.csv2(tab_khi2, file = "tab_khi2.csv", row.names = FALSE)

# Calcul du V de Cramer

# Fumeur
n1 <- sum(tableau_croise_sport)
m1 <- min(nrow(tableau_croise_sport) - 1, ncol(tableau_croise_sport) - 1)
v1 <- sqrt(Fumeur$statistic / (n1 * m1))

# Alimentation
n2 <- sum(tableau_croise_sport2)
m2 <- min(nrow(tableau_croise_sport2) - 1, ncol(tableau_croise_sport2) - 1)
v2 <- sqrt(Alimentation$statistic / (n2 * m2))

# Santé
n3 <- sum(tableau_croise_sport3)
m3 <- min(nrow(tableau_croise_sport3) - 1, ncol(tableau_croise_sport3) - 1)
v3 <- sqrt(Sante$statistic / (n3 * m3))

# Créer le tableau du V de Cramer
vcrammer <- c(v1, v2, v3)
tab_vcrammer <- data.frame(
  variables_quali = c("Fumeur", "Alimentation", "Santé"),
  vcrammer = vcrammer
)

# Exporter les résultats
write.csv2(tab_vcrammer, file = "tab_vcrammer.csv", row.names = FALSE)