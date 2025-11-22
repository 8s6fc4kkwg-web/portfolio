
#---------------------------------------------------------------------------------------------------------
#Chemin du répertoire
#---------------------------------------------------------------------------------------------------------

setwd("C:/Users/tpetit07.PEDA/OneDrive - Université de Poitiers/IUT poitiers/BUREAU/Régréssion linéaire")


#---------------------------------------------------------------------------------------------------------
# Import des fichiers train et test  
#---------------------------------------------------------------------------------------------------------

train <- read.csv2("train.csv")
test<- read.csv2("test.csv")


#---------------------------------------------------------------------------------------------------------
# Mise en forme avant traitement
#---------------------------------------------------------------------------------------------------------

deciles <- quantile(train$Valeur.fonciere, probs = seq(0.1, 0.9, by = 0.1))
print(deciles)

#On assigne a df la populaiton comprise entre le 5ème centile et le 95ème
df <- train[train$Valeur.fonciere >= deciles[1] & train$Valeur.fonciere <= deciles[9], ]



#---------------------------------------------------------------------------------------------------------
# Catégories en fonction du logement
#---------------------------------------------------------------------------------------------------------

maison <- df[df$Type.local == "Maison", ]

appartement <- df[df$Type.local == "Appartement", ]


#---------------------------------------------------------------------------------------------------------
# Catégories en fonction du nombre d'habitants 
#------------------------------------------------- Moins 500 -----------------------------------------------------


a <- c(
  "ADILLY", "AMURE", "ASNIERES EN POITOU", "AUBIGNE", "AUBIGNY", "AVAILLES-THOUARSAIS", 
  "AVON", "LA BOISSIERE-EN-GATINE", "BOUGON", "BOUSSAIS", "BRIEUIL-SUR-CHIZE", "CAUNAY", 
  "LA CHAPELLE BATON", "LA CHAPELLE BERTRAND", "LA CHAPELLE POUILLOUX", "LES CHATELIERS", 
  "CHENAY", "CHERIGNE", "LE CHILLOU", "CLAVE", "COULONGES-THOUARSAIS", "COUTURE-D ARGENSON", 
  "DOUX", "ENSIGNE", "FENERY", "FOMPERRON", "LES FORGES", "FOSSES (LES)", "GEAY", "GENNETON", 
  "LES GROSEILLERS", "IRAIS", "JUILLE", "JUSCORPS", "LAGEON", "LHOUMOIS", "LORIGNE", "LOUBIGNE", 
  "LOUBILLE", "LUCHE-SUR-BRIOUX", "LUSSERAY", "MAISONNAIS", "MAISONTIERS", "MARNES", "MELLERAN", 
  "MESSE", "MONTALEMBERT", "MONTRAVERS", "NEUVY-BOUIN", "OROUX", "PAIZAY-LE-CHAPT", "PAMPLIE", 
  "PAS-DE-JEU", "PERS", "PIERREFITTE", "PLIBOU", "POUGNE-HERISSON", "PRESSIGNY", "PUIHARDY", 
  "REFFANNES", "LE RETAIL", "SAINT-COUTANT", "SAINT-CYR-LA-LANDE", "SAINT-GENEROUX", 
  "SAINT-GEORGES-DE-REX", "ST GERMAIN DE LONGUE CHAUME", "SAINT-GERMIER", 
  "SAINT-JACQUES-DE-THOUARS", "SAINT-LIN", "SAINT-MAIXENT-DE-BEUGNE", "SAINT-MARC-LA-LANDE", 
  "SAINT-MARTIN-DE-MACON", "SAINT-MARTIN-DU-FOUILLOUX", "SAINT-PAUL-EN-GATINE", 
  "SAINT-ROMANS-DES-CHAMPS", "SAINTE-GEMME", "SAINTE-SOLINE", "SALLES", "SAURAIS", "SCILLE", 
  "SECONDIGNE-SUR-BELLE", "SELIGNE", "SOUDAN", "TOURTENAY", "TRAYES", "VANZAY", "VANCAIS", 
  "VAUSSEROUX", "VAUTEBIS", "VERNOUX-SUR-BOUTONNE", "LE VERT", "VILLEFOLLET", "VILLEMAIN", 
  "VILLIERS-EN-BOIS", "VILLIERS-SUR-CHIZE", "VOUHE", "XAINTRAY"
)

MaisonMoins500 <- maison[maison$Commune %in% a,] 

#---------------------------------------------Moins 1000---------------------------------------------------------

b <- c(
  "ALLOINAY", "ALLONNE", "AMAILLOUX", "ARCAIS", "ASSAIS-LES-JUMEAUX", "AUGE", 
  "BEAULIEU-SOUS-PARTHENAY", "BEAUSSAIS-VITRE", "BECELEUF", "BEUGNON-THIREUIL", 
  "LE BOURDET", "BRETIGNOLLES", "BRION-PRES-THOUET", "BRULAIN", "LE BUSSEAU", 
  "CHANTELOUP", "CHEY", "CHIZE", "CIRIERES", "CLESSE", "CLUSSAIS-LA-POMMERAIE", 
  "COURS", "EPANNES", "EXOUDUN", "FAYE-SUR-ARDIN", "FENIOUX", "LA FERRIERE-EN-PARTHENAY", 
  "FONTENILLE-ST-MARTIN-D'ENTRAIG", "FONTIVILLIE", "LA FOYE MONJAULT", "FRANCOIS", 
  "GLENAY", "GOURGE", "GRANZAY-GRIPT", "LARGEASSE", "LIMALONGES", "LOUIN", 
  "LUCHE-THOUARSAIS", "LUZAY", "MAIRE LEVESCAULT", "MARCILLE", "MARIGNY", 
  "MENIGOUTE", "PERIGNE", "LA PETITE BOISSIERE", "PLAINE-D'ARGENSON", "PRAILLES-LA COUARDE", 
  "PRIN-DEYRANCON", "LA ROCHENARD", "ROM", "ROMANS", "SAINT-ANDRE-SUR-SEVRE", 
  "SAINT-AUBIN-DU-PLAIN", "SAINT-CHRISTOPHE-SUR-ROC", "ST GEORGES DE NOISNE", 
  "SAINT-LAURS", "SAINT-MARTIN-DE-BERNEGOUE", "SAINT MAURICE ETUSSON", "SAINT-POMPAIN", 
  "SAINT-ROMANS-LES-MELLE", "SAINT-VINCENT-LA-CHATRE", "SAINTE-EANNE", "SAINTE-OUENNE", 
  "SANSAIS", "SCIECQ", "SEPVRET", "SOUVIGNE", "SURIN", "VALDELAUME", "VALLANS", 
  "LE VANNEAU-IRLEAU", "VERNOUX-EN-GATINE", "VERRUYES"
)
MaisonMoins1000 <- maison[maison$Commune %in% b,] 

#------------------------------------------- Moins 10000  ------------------------------------------------------------

c <- c(
  "L ABSIE", "AIFFRES", "AIGONDIGNE", "AIRVAULT", "ARDIN", "ARGENTONNAY", 
  "AZAY-LE-BRULE", "AZAY-SUR-THOUET", "BEAUVOIR-SUR-NIORT", "BESSINES", "BOISME", 
  "BRIOUX-SUR-BOUTONNE", "CELLES-SUR-BELLE", "CERIZAY", "CHAMPDENIERS", 
  "LA CHAPELLE-SAINT-LAURENT", "CHATILLON SUR THOUET", "CHAURAY", "CHEF-BOUTONNE", 
  "CHERVEUX", "CHICHE", "COMBRAND", "COULON", "COULONGES-SUR-L AUTIZE", "COURLAY", 
  "LA CRECHE", "ECHIRE", "EXIREUIL", "FAYE-L ABBESSE", "LA FORET-SUR-SEVRE", "FORS", 
  "FRESSINES", "FRONTENAY-ROHAN-ROHAN", "GERMOND-ROUVRE", "LEZAY", "LORETZ-D ARGENTON", 
  "LOUZY", "MAGNE", "MAULEON", "MAUZE-SUR-LE-MIGNON", "MAZIERES-EN-GATINE", "MELLE", 
  "MONCOUTANT-SUR-SEVRE", "LA MOTHE SAINT HERAY", "NANTEUIL", "NIORT", "NUEIL-LES-AUBIERS", 
  "PAMPROUX", "LA PEYRATTE", "LE PIN", "PLAINE-ET-VALLEES", "POMPAIRE", 
  "PRAHECQ", "SAINT AMAND SUR SEVRE", "SAINT-AUBIN-LE-CLOUD", "SAINT GELAIS", 
  "SAINT-HILAIRE-LA-PALUD", "SAINT JEAN DE THOUARS", "SAINT-LEGER-DE-MONTBRUN", 
  "SAINT-LOUP-LAMAIRE", "ST MAIXENT L ECOLE", "ST MARTIN DE ST MAIXENT", 
  "SAINT-MARTIN-DE-SANZAY", "SAINT-MAXIRE", "SAINT-PARDOUX-SOUTIERS", 
  "ST PIERRE DES ECHAUBROGNES", "SAINT-REMY", "SAINT-SYMPHORIEN", "SAINT-VARENT", 
  "SAINTE-NEOMAYE", "SAINTE-VERGE", "SAIVRES", "SAUZE-VAUSSAIS", "SECONDIGNY", 
  "LE TALLUD", "THENEZAY", "VAL-DU-MIGNON", "VAL EN VIGNES", "VASLES", 
  "VIENNAY", "VILLIERS-EN-PLAINE", "VOUILLE", "VOULMENTIN"
)

MaisonMoins10000 <- maison[maison$Commune %in% c,] 

#-------------------------------------------- Plus 10000 --------------------------------------------------------

d <- c("BRESSUIRE", "NIORT", "PARTHENAY", "THOUARS")

MaisonPlus10000 <- maison[maison$Commune %in% d,]


#---------------------------------------------------------------------------------------------------------
#MODELES LOGARITHMIQUES
#---------------------------------------------------------------------------------------------------------


#---------------------------------------------------------------------------------------------------------
#-500 hab


# Transformation
y1 <- MaisonMoins500$Valeur.fonciere
x1 <- log(MaisonMoins500$Surface.reelle.bati)

# Modèle linéaire sur log(y) et log(x)
covxy <- cov(x1, y1)
varx <- var(x1)
a <- covxy / varx
b <- mean(y1) - a * mean(x1)

# Prédictions
yi <- a  * x1 + b

MaisonMoins500$prediction <- yi



#---------------------------------------------------------------------------------------------------------
#500-100 habs


# Transformation
y2 <- MaisonMoins1000$Valeur.fonciere
x2 <- log(MaisonMoins1000$Surface.reelle.bati)

# Modèle linéaire sur log(y) et log(x)
covxy <- cov(x2, y2)
varx <- var(x2)
a2 <- covxy / varx
b2 <- mean(y2) - a2 * mean(x2)

# Prédictions
yi <- a2  * x2 + b2

MaisonMoins1000$prediction <- yi


#---------------------------------------------------------------------------------------------------------
# -10000 habs

# Transformation
y3 <- MaisonMoins10000$Valeur.fonciere
x3 <- log(MaisonMoins10000$Surface.reelle.bati)

# Modèle linéaire sur log(y) et log(x)
covxy <- cov(x3, y3)
varx <- var(x3)
a3 <- covxy / varx
b3 <- mean(y3) - a3 * mean(x3)

# Prédictions
yi <- a3  * x3 + b3

MaisonMoins10000$prediction <- yi


#---------------------------------------------------------------------------------------------------------
# +10000 habs

# Transformation
y4 <- MaisonPlus10000$Valeur.fonciere
x4 <- log(MaisonPlus10000$Surface.reelle.bati)

# Modèle linéaire sur log(y) et log(x)
covxy <- cov(x4, y4)
varx <- var(x4)
a4 <- covxy / varx
b4 <- mean(y4) - a4 * mean(x4)

# Prédictions
yi <- a4  * x4 + b4

MaisonPlus10000$prediction <- yi



#---------------------------------------------------------------------------------------------------------
# Appartement -2 pièces


appartement2etmoins <-  df[df$Nombre.pieces.principales <=2 & df$Type.local == "Appartement", ]


# Transformation
y5 <- appartement2etmoins$Valeur.fonciere
x5 <- log(appartement2etmoins$Surface.reelle.bati)

# Modèle linéaire sur log(y) et log(x)
covxy <- cov(x5, y5)
varx <- var(x5)
a5 <- covxy / varx
b5 <- mean(y5) - a5 * mean(x4)

# Prédictions
yi <- a5  * x5 + b5

appartement2etmoins$prediction <- yi



#---------------------------------------------------------------------------------------------------------
# Appartement +2 pièces

appartement2plus <- df[df$Nombre.pieces.principales >2 & df$Type.local == "Appartement", ]


# Transformation
y6 <- appartement2plus$Valeur.fonciere
x6 <- log(appartement2plus$Surface.reelle.bati)

# Modèle linéaire sur log(y) et log(x)
covxy <- cov(x6, y6)
varx <- var(x6)
a6 <- covxy / varx
b6 <- mean(y6) - a6 * mean(x6)

# Prédictions
yi <- a6  * x6 + b6

appartement2plus$prediction <- yi



#---------------------------------------------------------------------------------------------------------
# Catégoriser le test
#---------------------------------------------------------------------------------------------------------

# Maisons
t_MaisonMoins500 <- test[test$Commune %in% a & test$Type.local == "Maison", ]
t_MaisonMoins1000 <- test[test$Commune %in% b & test$Type.local == "Maison", ]
t_MaisonMoins10000 <- test[test$Commune %in% c & test$Type.local == "Maison", ]
t_MaisonPlus10000 <- test[test$Commune %in% d & test$Type.local == "Maison", ]


# Appartement 
t_appartement2etmoins <- test[test$Nombre.pieces.principales <=2 & test$Type.local == "Appartement", ]
t_appartement2Plus <- test[test$Nombre.pieces.principales >2 & test$Type.local == "Appartement", ]
  

#---------------------------------------------------------------------------------------------------------
# application du modèle
#---------------------------------------------------------------------------------------------------------

# maisons -500
x10 <- t_MaisonMoins500$Surface.reelle.bati
t_MaisonMoins500$Valeur.fonciere <- (a*log(x10)+b)

# maisons -1000
x11 <- t_MaisonMoins1000$Surface.reelle.bati
t_MaisonMoins1000$Valeur.fonciere <- (a2*log(x11)+b2)

# maisons -10000
x12 <- t_MaisonMoins10000$Surface.reelle.bati
t_MaisonMoins10000$Valeur.fonciere <- (a3*log(x12)+b3)

# maisons +10000
x13 <- t_MaisonPlus10000$Surface.reelle.bati
t_MaisonPlus10000$Valeur.fonciere <- (a4*log(x13)+b4)


# Appart -2 pièces
x14 <- t_appartement2etmoins$Surface.reelle.bati
t_appartement2etmoins$Valeur.fonciere <- (a5*log(x14)+b5)

# Appart +2 pièces
x15 <- t_appartement2Plus$Surface.reelle.bati
t_appartement2Plus$Valeur.fonciere <- (a6*log(x15)+b6)



#---------------------------------------------------------------------------------------------------------
# Mise en forme avant exportation
#---------------------------------------------------------------------------------------------------------


# Sélectionner uniquement les colonnes "id" et "Valeur.fonciere"

t_MaisonMoins500 <- t_MaisonMoins500[, c("id", "Valeur.fonciere")]
t_MaisonMoins1000 <- t_MaisonMoins1000[, c("id", "Valeur.fonciere")]
t_MaisonMoins10000 <- t_MaisonMoins10000[, c("id", "Valeur.fonciere")]
t_MaisonPlus10000 <- t_MaisonPlus10000[, c("id", "Valeur.fonciere")]
t_appartement2etmoins <- t_appartement2etmoins[, c("id", "Valeur.fonciere")]
t_appartement2Plus <- t_appartement2Plus[, c("id", "Valeur.fonciere")]


# Fusionner les deux dataframe
prediction2 <- rbind(t_MaisonMoins500, t_MaisonMoins1000, t_MaisonMoins10000, t_MaisonPlus10000, t_appartement2etmoins, t_appartement2Plus)


#---------------------------------------------------------------------------------------------------------
# Export du fichier
#---------------------------------------------------------------------------------------------------------

# export du fichier CSV
write.csv2(prediction2, file = "prediction.csv", row.names = FALSE)


