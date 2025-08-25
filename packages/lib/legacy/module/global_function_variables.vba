Option Explicit

'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''                                                                        '''''''''''''''''''''''''''''''''''
''''''''''''                     Globale Variablen                                  '''''''''''''''''''''''''''''''''''
''''''''''''                                                                        '''''''''''''''''''''''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''

Public VBAcoustic As String
Public bDebug As Boolean

Public intAppHeight As Integer
Public intAppWidth As Integer
Public appExcel As Excel.Application

'globale Listen der Klassenobjekte
Public clsDecke()       As clsTrenndecke
Public clsWand()        As clsTrennwand
Public clsFlanke()      As clsFlankenbauteil

'Aktuelle Nr des Flankenbauteils
Public intFlankenNr     As Integer

'Bool-Variable zur Unterscheidung zwischen differenzierter Berechnung und Berechnung nach DIN 4109
Public bDIN4109 As Boolean

'Bool-Variablen für die Flankenbauteiltyp-Gruppen
Public bMassivFlanke As Boolean
Public bMassivholzFlanke As Boolean
Public bLeichtbauFlanke As Boolean

'Bool-Variable die offene Bauteilkataloge anzeigt
Public BTK_DIN4109_33 As Boolean
Public BTK_TH_Rosenheim As Boolean
Public BTK_HS As Boolean

'Bool-Variable für die Ergebnisdarstellung
Public PDFextern As Boolean

'Bool-Variable zur steuerung der Bildschirmauflösung
Public bScaling As Boolean


'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''                                                                                                         '''''''
'''''''                     Globale Definition der Bauteile und Bauteilschichten                                '''''''
'''''''                                                                                                         '''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'Estrichaufbauten
Public Const ZE_MF As String = "Zementestrich auf Mineralfaser"
Public Const ZE_WF As String = "Zementestrich auf Holzfaser"
Public Const TE As String = "Trockenestrich"

'Trenn-Deckentypen
Public Const HBD_OFFEN As String = "offene Holzbalkendecke"
Public Const HBD_L_GK As String = "Holzbalkendecke mit Lattung + GK"
Public Const HBD_ABH_GK As String = "Holzbalkendecke mit Abh./FS + 1 x GK"
Public Const HBD_ABH_2GK As String = "Holzbalkendecke mit Abh./FS + 2 x GK"
Public Const MHD As String = "Massivholzdecke" '"Massivholzdecke ohne Unterdecke"
Public Const MHD_UD As String = "Massivholzdecke mit Unterdecke"
Public Const MHD_RIPPEN_KASTEN As String = "Rippen/-Kastenelementdecke"
Public Const MHD_HBV As String = "Holz-Beton-Verbunddecke"
'Public Const SBD As String = "Stahlbetondecke"

'Flankierende Wände von Trenndecken
Public Const MW As String = "Massivwand"
Public Const MHW As String = "Massivholzwand"
Public Const HSTW As String = "Holztafel-/Holzständerwand"
Public Const MSTW As String = "Metallständerwand"
Public Const OHNE As String = "keine (versetze Wand)"
'Wandbeplankungen der flankierenden Wände
Public Const HWST_GK As String = "Holzwerkstoffplatte + GKP"
Public Const GF As String = "Gipsfaser"
Public Const HWST As String = "Holzwerkstoffplatte"



'Trennwand: Anwendungsbereiche
Public Const IW As String = "Innenwand"
Public Const WTW As String = "Wohnungstrennwand (einschalig)"
Public Const WTW_2 As String = "Wohnungstrennwand (zweischalig)"
Public Const GTW As String = "Gebäudetrennwand"

'Trennwand: Flankierende Decken und Dächer
Public Const SBD As String = "Stahlbetondecke"
'Public Const MHD As String = "Massivholzdecke"
Public Const HBD As String = "Holzbalkendecke"
Public Const SB_FlACHD As String = "Stahlbeton-Flachdach"
Public Const MH_FLACHD As String = "Massivholz-Flachdach"
Public Const HB_FLACHD As String = "Balkenlage-Flachdach"
Public Const SP_STEILD As String = "Sparren-Steildach"
'Unterscheidung für flankierende Massivholzdecken oder -Flachdächer:
Public Const MHE As String = "Massivholzelement"
Public Const MHE_SPLITT As String = "Massivholzelement + Schüttung"
Public Const MHE_HBV As String = "HBV-Element"

'Materialunterscheidung Massivbau
Public Const SB_KS_MZ As String = "Beton, KS-Stein, Mauerziegel"
Public Const LEICHTB As String = "Leichtbeton"
Public Const PORENB As String = "Porenbeton"


'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''                                                                                                         '''''''
'''''''                     Globale Definition der Stoßstellen                                                  '''''''
'''''''                                                                                                         '''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'Stoßstellen Decke/Wand -> vertikale Schallübertragung
Public Const T_STOSS As String = "T-Stoss"
Public Const T_STOSS_ELAST_OBEN As String = "T-Stoss ELASTOMER oben"
Public Const T_STOSS_ELAST_OBEN_UNTEN As String = "T-Stoss ELASTOMER oben+unten"
Public Const X_STOSS As String = "X-Stoss"
Public Const X_STOSS_ELAST_OBEN As String = "X-Stoss ELASTOMER oben"
Public Const X_STOSS_ELAST_OBEN_UNTEN As String = "X-Stoss ELASTOMER oben+unten"

'Stoßstellen Wand/Wand -> horizontale Schallübertragung
Public Const T_STOSS_DURCHLAUFEND As String = "T-Stoss, flankierende Wand durchlaufend"
Public Const T_STOSS_GETRENNT As String = "T-Stoss, flankierende Wand getrennt"
Public Const T_STOSS_WAND_VOLL_GETRENNT As String = "T-Stoss, flankierende Wand vollständig unterbrochen"
Public Const T_STOSS_DECKE_VOLL_GETRENNT As String = "T-Stoss, flankierende Decke vollständig getrennt"
Public Const T_STOSS_UNTERBROCHEN As String = "T-Stoss, flankierende Wand unterbrochen"
Public Const X_STOSS_DURCHLAUFEND As String = "X-Stoss, flankierende Wand durchlaufend"
Public Const X_STOSS_GETRENNT As String = "X-Stoss, flankierende Wand getrennt"
Public Const X_STOSS_UNTERBROCHEN As String = "X-Stoss, flankierende Wand unterbrochen"
'Bezugsquelle der Stoßstellendämm-Maße
Public Const DIN_EN_ISO12354 As String = "DIN EN ISO 12354-1"
Public Const DIN4109_32 As String = "DIN 4109-32"
Public Const DIN4109_33 As String = "DIN 4109-33 (neu)"
Public Const VIBROAKUSTIK = "Vibroakustik Projekt"

'Raumanordnung zwischen Sende- und Empfangsraum
Public Const OHNE_VERSATZ As String = "Räume mit geringem Versatz"
Public Const MIT_VERSATZ As String = "Räume mit Versatz > 0,5 m"
Public Const DIAGONAL As String = "Räume diagonal versetzt"

'Art des Stossstellenversatzes
Public Const WAND_LINKS_AUSSEN As String = "Versatz der linken Wand (im Empfangsraum) nach außen"
Public Const WAND_LINKS_INNEN As String = "Versatz der linken Wand (im Empfangsraum) nach innEn"
Public Const WAND_RECHTS_AUSSEN As String = "Versatz der rechten Wand (im Empfangsraum) nach außen"
Public Const WAND_RECHTS_INNEN As String = "Versatz der rechten Wand (im Empfangsraum) nach innEn"


Public Const LEER As Integer = 0




'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''                                                                        '''''''''''''''''''''''''''''''''''
''''''''''''                Globale Prozeduren und Funktionen                       '''''''''''''''''''''''''''''''''''
''''''''''''                                                                        '''''''''''''''''''''''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''


''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''   Daten der Bauteile aus Dialogbox des Bauteilkataloges in das Tabellenblatt übertragen    ''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Sub BauteildatenDecke(Lnw As Double, Rw As Double, CI50 As Double, TabNr As Integer, ZNr As Integer, Biegeweich As String, Deckenmasse As Double, DRUnterdecke As Double, DLUnterdecke As Double, Quelle As String)

    'Variablen deklarieren
    Dim Bild As String
    Dim Konstruktion As String
    
    'Bild- und Konstruktionsnamen aufbauen
    Bild = "ImT" & TabNr & "Z" & ZNr
    Konstruktion = "ImKonT" & TabNr & "Z" & ZNr
    
    'Einzahlwerte Rw, Ln,w und CI zuweisen
    frmVBAcousticTrenndecke.txtLnw = Lnw
    frmVBAcousticTrenndecke.txtRw = Rw
    clsDecke(1).CI50 = CI50
    
    'Datenquelle (Bauteildatenbank) übergeben
    If Quelle = "DIN4109_33_Decken" Then
        Application.ActiveSheet.[Quelle] = "Quelle: DIN 4109-33:2016-07, Tabelle " & TabNr & ", Zeile " & ZNr
        clsDecke(1).Quelle = "Quelle: DIN 4109-33:2016-07, Tabelle " & TabNr & ", Zeile " & ZNr
    ElseIf Quelle = "TH_Rosenheim_Decken" Then
        Application.ActiveSheet.[Quelle] = "Quelle: Bauteilkatalog TH Rosenheim:2018-12, Tabelle " & TabNr & ", Zeile " & ZNr
        clsDecke(1).Quelle = "Quelle: Bauteilkatalog TH Rosenheim:2018-12, Tabelle " & TabNr & ", Zeile " & ZNr
    End If
    
    'Daten für die Berechnung von Rw der Rohdecke mit Beschwerung übergeben
    frmVBAcousticTrenndecke.txtBiegeweich = Biegeweich
    frmVBAcousticTrenndecke.txtMasseDecke = Deckenmasse
    
    'Daten für die Berücksichtigung der Unterdecke übergeben
    If DRUnterdecke > 0 Then
        frmVBAcousticTrenndecke.txtDRUnterdecke = DRUnterdecke
        frmVBAcousticTrenndecke.txtDLUnterdecke = DLUnterdecke
    Else
        frmVBAcousticTrenndecke.txtDRUnterdecke = 0
        frmVBAcousticTrenndecke.txtDLUnterdecke = 0
    End If
    
    'Tabellenblatt "Bauteilschichten" initialisieren, alte Eigaben und Bilder löschen
    Call Worksheets("Bauteilschichten").initialize_Bauteilschichten

End Sub
Sub BauteildatenWand(Rw As Double, C50 As String, Ctr50 As String, TabNr As Integer, ZNr As Integer, Elementmasse As String, Rsw As String, DRw_SR As String, DRw_ER As String, Quelle As String)

    'Variablen deklarieren
    Dim Bild As String
    Dim Konstruktion As String
    
    'Bild- und Konstruktionsnamen aufbauen
    Bild = "ImT" & TabNr & "Z" & ZNr
    Konstruktion = "ImKonT" & TabNr & "Z" & ZNr
    
    'Einzahlwerte Rw, C50 und , Ctr50 zuweisen
    frmVBAcousticTrennwand.txtRw_Holz = Rw
    clsWand(1).C50 = IIf(C50 <> "nv", C50, 0)
    clsWand(1).Ctr50 = IIf(Ctr50 <> "nv", Ctr50, 0)
    
    'Werte der Grundwand Rsw, Elementmasse, und der Vorsatzschalen DRw übergeben
    clsWand(1).Rsw = IIf(Rsw <> "nv", Rsw, 0)
    clsWand(1).WandmasseTbt = IIf(Elementmasse <> "nv", Elementmasse, 0)
    clsWand(1).DRw_SR = IIf(DRw_SR <> "nv", DRw_SR, 0)
    clsWand(1).DRw_ER = IIf(DRw_ER <> "nv", DRw_ER, 0)
    frmVBAcousticTrennwand.txtDRwSR = IIf(DRw_SR <> "nv", DRw_SR, "")
    frmVBAcousticTrennwand.txtDRwER = IIf(DRw_ER <> "nv", DRw_ER, "")
    
    'Datenquelle (Bauteildatenbank) übergeben
    If Quelle = "DIN4109_33_Waende" Then
        Application.ActiveSheet.[Quelle_Trennbauteil] = "Quelle: DIN 4109-33:2016-07, Tabelle " & TabNr & ", Zeile " & ZNr
        clsWand(1).Quelle_Tbt = "Quelle: DIN 4109-33:2016-07, Tabelle " & TabNr & ", Zeile " & ZNr
    ElseIf Quelle = "TH_Rosenheim_Waende" Then
        Application.ActiveSheet.[Quelle_Trennbauteil] = "Quelle: Bauteilkatalog TH Rosenheim:2018-12, Tabelle " & TabNr & ", Zeile " & ZNr
        clsWand(1).Quelle_Tbt = "Quelle: Bauteilkatalog TH Rosenheim:2018-12, Tabelle " & TabNr & ", Zeile " & ZNr
    End If
    
    'Elementmasse mit direkter Beplankung übergeben
    frmVBAcousticTrennwand.txtmstrichTrennbt = IIf(Elementmasse <> "nv", Elementmasse, "-")
    
    
    'Tabellenblatt "Bauteilschichten" initialisieren, alte Eigaben und Bilder löschen
    Call Worksheets("Bauteilschichten").initialize_Bauteilschichten

End Sub

'BauteildatenFlanke(Name As String, Dnfw As Double, TabNr As Integer, ZNr As Integer)
Sub BauteildatenFlanke(Name As String, Dnfw As Double, TabNr As Integer, ZNr As Integer, Quelle As String)

    'Variablen deklarieren
    Dim Bild As String
    Dim Konstruktion As String
    
    'Einzahlwert Dn,f,w zuweisen
    frmVBAcousticTrennwand.txtDnfwFlanke = Dnfw
    
    'Datenquelle (Bauteildatenbank) übergeben
    If Quelle = "DIN4109_33_Leichtbauflanken" Then
        clsFlanke(intFlankenNr).Quelle = "Quelle: DIN 4109-33:2016-07, Tabelle " & TabNr & ", Zeile " & ZNr
    ElseIf Quelle = "TH_Rosenheim_Leichtbauflanken" Then
        clsFlanke(intFlankenNr).Quelle = "Quelle: Bauteilkatalog TH Rosenheim:2018-12, Tabelle " & TabNr & ", Zeile " & ZNr
    End If
    
End Sub
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''''''''''   Konstruktionsbeschreibung und Skizze aus Bauteilbezeichnung ableiten   ''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Sub Konstruktionsbeschreibung(Name As String)

   Dim inti As Integer, Schichten() As String
   
   'Name in einzelne Bauteilschichten aufsplitten
   Schichten = Split(Name, "_")
   
   
   'Darstellung und Beschreibung der Konstruktion
   For inti = 0 To UBound(Schichten)
   
        'Unterscheidung der Bauteilschichten
        Select Case Schichten(inti)
            
            Case "B":                                                                                       'Bauteil
            
            'Estrichaufbauten
            Case "sCE50": Call Worksheets("Bauteilschichten").AddImg("imgB_sCE50", "imgK_sCE50")            '50 mm Zementestrich
            Case "sCE80": Call Worksheets("Bauteilschichten").AddImg("imgB_sCE80", "imgK_sCE80")            '80 mm Zementestrich
            Case "sDRY18": Call Worksheets("Bauteilschichten").AddImg("imgB_sDRY18", "imgK_sDRY18")         '18 mm Trockenestrich
            Case "sDRY20": Call Worksheets("Bauteilschichten").AddImg("imgB_sDRY18", "imgK_sDRY20")         '20 mm Trockenestrich
            Case "sDRY22": Call Worksheets("Bauteilschichten").AddImg("imgB_sDRY24", "imgK_sDRY22")         '22 mm Trockenestrich
            Case "sDRY24": Call Worksheets("Bauteilschichten").AddImg("imgB_sDRY24", "imgK_sDRY24")         '24 mm Trockenestrich
            Case "sDRY25": Call Worksheets("Bauteilschichten").AddImg("imgB_sDRY24", "imgK_sDRY25")         '25 mm Trockenestrich
            Case "sAS30": Call Worksheets("Bauteilschichten").AddImg("imgB_sAS30", "imgK_sAS30")            '30 mm Gussasphalt
            Case "sAH50": Call Worksheets("Bauteilschichten").AddImg("imgB_sCE50", "imgK_sCE50")            '50 mm Anhydritestrich
            Case "bPL24": Call Worksheets("Bauteilschichten").AddImg("imgB_bPL24", "imgK_bPL24")            '24 mm Dielenboden
            
            'Trittschalldämmung
            Case "ipMF40sd6": Call Worksheets("Bauteilschichten").AddImg("imgB_ipMF40sd6", "imgK_ipMF40sd6")            '40 mm Mineralfaser s' = 6 MN/m³
            Case "ipMF40sd7": Call Worksheets("Bauteilschichten").AddImg("imgB_ipMF40sd7", "imgK_ipMF40sd7")           '40 mm Mineralfaser s' = 7 MN/m³
            Case "ipMF20sd8": Call Worksheets("Bauteilschichten").AddImg("imgB_ipMF20sd8", "imgK_ipMF20sd8")            '20 mm Mineralfaser s' = 8 MN/m³
            Case "ipMF30sd8": Call Worksheets("Bauteilschichten").AddImg("imgB_ipMF30sd8", "imgK_ipMF30sd8")            '30 mm Mineralfaser s' = 8 MN/m³
            Case "ipMF20sd10": Call Worksheets("Bauteilschichten").AddImg("imgB_ipMF20sd10", "imgK_ipMF20sd10")         '20 mm Mineralfaser s' = 10 MN/m³
            Case "ipMF25sd15": Call Worksheets("Bauteilschichten").AddImg("imgB_ipMF25sd15", "imgK_ipMF25sd15")         '25 mm Mineralfaser s' = 15 MN/m³
            Case "ipMF30sd20": Call Worksheets("Bauteilschichten").AddImg("imgB_ipMF30sd20", "imgK_ipMF30sd20")         '30 mm Mineralfaser s' = 20 MN/m³
            Case "ipMF20sd20": Call Worksheets("Bauteilschichten").AddImg("imgB_ipMF20sd20", "imgK_ipMF20sd20")         '20 mm Mineralfaser s' = 20 MN/m³
            Case "ipMF20sd30": Call Worksheets("Bauteilschichten").AddImg("imgB_ipMF20sd30", "imgK_ipMF20sd30")         '20 mm Mineralfaser s' = 30 MN/m³
            Case "ipWF30sd30": Call Worksheets("Bauteilschichten").AddImg("imgB_ipWF30sd30", "imgK_ipWF30sd30")         '30 mm Holzfaser s' = 30 MN/m³
            Case "ipWF30sd20": Call Worksheets("Bauteilschichten").AddImg("imgB_ipWF30sd20", "imgK_ipWF30sd20")         '30 mm Holzfaser s' = 20 MN/m³
            Case "ipWF20sd30": Call Worksheets("Bauteilschichten").AddImg("imgB_ipWF20sd30", "imgK_ipWF20sd30")         '20 mm Holzfaser s' = 30 MN/m³
            Case "ipMF40sd20": Call Worksheets("Bauteilschichten").AddImg("imgB_ipMF40sd20", "imgK_ipMF40sd20")         '40 mm Steinwolle s' = 20 MN/m³
            Case "ipPST40sd10": Call Worksheets("Bauteilschichten").AddImg("imgB_ipPST40sd10", "imgK_ipPST40sd10")      '40 mm Polystyrol s' = 10 MN/m³
            Case "iWF40sd30||jWS40"
                Call Worksheets("Bauteilschichten").AddImg("imgB_iWF40sd30||jWS40", "imgK_iWF40sd30||jWS40")             '40 mm Holzfaser mit Leisten
            
            'Rohdeckenbeschwerung
            Case "wC45": Call Worksheets("Bauteilschichten").AddImg("imgB_wL45", "imgK_wL45")               '30 mm Schüttung in Waben, m' = 45 kg/m²
            Case "wC90": Call Worksheets("Bauteilschichten").AddImg("imgB_wL90", "imgK_wL90")               '60 mm Schüttung in Waben, m' = 90 kg/m²
            Case "wL12": Call Worksheets("Bauteilschichten").AddImg("imgB_wL12", "imgK_wL12")               '30 mm Schüttung,lose, m' = 12 kg/m²
            Case "wL25": Call Worksheets("Bauteilschichten").AddImg("imgB_wL25", "imgK_wL25")               '18 mm Schüttung,lose, m' = 25 kg/m²
            Case "wL45": Call Worksheets("Bauteilschichten").AddImg("imgB_wL45", "imgK_wL45")               '30 mm Schüttung,lose, m' = 45 kg/m²
            Case "wL60": Call Worksheets("Bauteilschichten").AddImg("imgB_wL60", "imgK_wL60")               '40 mm Schüttung,lose, m' = 60 kg/m²
            Case "wL75": Call Worksheets("Bauteilschichten").AddImg("imgB_wL75", "imgK_wL75")               '50 mm Schüttung,lose, m' = 75 kg/m²
            Case "wL90": Call Worksheets("Bauteilschichten").AddImg("imgB_wL90", "imgK_wL90")               '60 mm Schüttung,lose, m' = 90 kg/m²
            Case "wL105": Call Worksheets("Bauteilschichten").AddImg("imgB_wL105", "imgK_wL105")            '70 mm Schüttung,lose, m' = 105 kg/m²
            Case "wL120": Call Worksheets("Bauteilschichten").AddImg("imgB_wL120", "imgK_wL120")            '80 mm Schüttung,lose, m' = 120 kg/m²
            Case "wL150": Call Worksheets("Bauteilschichten").AddImg("imgB_wL150", "imgK_wL150")            '100 mm Schüttung,lose, m' = 150 kg/m²
            Case "wST100": Call Worksheets("Bauteilschichten").AddImg("imgB_wST100", "imgK_wST100")         '40 mm Betonplatten, m' = 100 kg/m²
            Case "wST150": Call Worksheets("Bauteilschichten").AddImg("imgB_wST150", "imgK_wST150")         '60 mm Betonplatten, m' = 150 kg/m²
            Case "wC200": Call Worksheets("Bauteilschichten").AddImg("imgB_wC200", "imgK_wC200")            '80 mm Beton (HBV), m' = 200 kg/m²
            Case "wC240": Call Worksheets("Bauteilschichten").AddImg("imgB_wC240", "imgK_wC240")            '100 mm Beton (HBV), m' = 240 kg/m²
            Case "wCECB50": Call Worksheets("Bauteilschichten").AddImg("imgB_wCECB50", "imgK_wCECB50")      '40 mm Zementgebundene Spanplatten, m' = 50 kg/m²
            
            'Rohdecke oder Wandelement (Grundwand)
            Case "bWF15": Call Worksheets("Bauteilschichten").AddImg("imgB_bWF15", "imgK_bWF15")            '15 mm Holzfaser als lastverteilende Schicht
            Case "bOSB22", "bCB22"                                                                          'Rohdeckenbeplankung OSB oder Holzwerkstoff
                If Schichten(inti + 1) = "jWS220" Then                                                      'offene Balkendecke
                    Call Worksheets("Bauteilschichten").AddImg("imgB_jWS220", "imgK_jWS220")
                ElseIf Schichten(inti + 1) = "jWS220||iMW100" Then                                          'Balkendecke mit 100 mm MF Dämmung
                    Call Worksheets("Bauteilschichten").AddImg("imgB_jWS220||iMW100", "imgK_jWS220||iMW100")
                ElseIf Schichten(inti + 1) = "jWS220||iMW200" Then                                          'Balkendecke mit 200 mm MF Dämmung
                    Call Worksheets("Bauteilschichten").AddImg("imgB_jWS220||iMW200", "imgK_jWS220||iMW200")
                End If
            Case "jWS220", "jWS220||iMW100", "jWS220||iMW200"                                               'Nichts tun - wurde oben schon berücksichtigt
            Case "bCLT80": Call Worksheets("Bauteilschichten").AddImg("imgB_bCLT80", "imgK_bCLT80")         '80 mm Brettsperrholzelement
            Case "bCLT90": Call Worksheets("Bauteilschichten").AddImg("imgB_bCLT90", "imgK_bCLT90")         '90 mm Brettsperrholzelement
            Case "bCLT100": Call Worksheets("Bauteilschichten").AddImg("imgB_bCLT100", "imgK_bCLT100")      '100 mm Brettsperrholzelement
            Case "bCLT120": Call Worksheets("Bauteilschichten").AddImg("imgB_bCLT120", "imgK_bCLT120")      '120 mm Brettsperrholzelement
            Case "bCLT140": Call Worksheets("Bauteilschichten").AddImg("imgB_bCLT140", "imgK_bCLT140")      '140 mm Brettsperrholzelement
            Case "bLFE240": Call Worksheets("Bauteilschichten").AddImg("imgB_bLFE240", "imgK_bLFE240")      '240 mm Kastenelement
            Case "bLFE240silence"
                Call Worksheets("Bauteilschichten").AddImg("imgB_bLFE240silence", "imgK_bLFE240silence")   '240 mm Lignatur LFE silence
            Case "bLFE240silenceAkustik"
                Call Worksheets("Bauteilschichten").AddImg("imgB_bLFE240silenceAkustik", "imgK_bLFE240silenceAkustik")   '240 mm Lignatur LFE silence
            Case "bQ3Rippe215||wL147"
                Call Worksheets("Bauteilschichten").AddImg("imgB_bQ3Rippe215||wL147", "imgK_bQ3Rippe215||wL147")           '215 mm Lignotrend Rippe Q3
            Case "bQ3Decke262||wL196"
                Call Worksheets("Bauteilschichten").AddImg("imgB_bQ3Decke262||wL196", "imgK_bQ3Decke262||wL196")           '262 mm Lignotrend Decke Q3
            Case "frT80||iMW40": Call Worksheets("Bauteilschichten").AddImg("imgB_frT80||iMW40", "imgK_frT80||iMW40")      '80 mm Holzständer mit 40 mm Faserdämmstoff
            Case "frT100||iMW60": Call Worksheets("Bauteilschichten").AddImg("imgB_frT100||iMW60", "imgK_frT100||iMW60")   '100 mm Holzständer mit 60 mm Faserdämmstoff
            Case "frT100||iMW80": Call Worksheets("Bauteilschichten").AddImg("imgB_frT100||iMW80", "imgK_frT100||iMW80")   '100 mm Holzständer mit 60 mm Faserdämmstoff
            Case "frT60||iMW60": Call Worksheets("Bauteilschichten").AddImg("imgB_frT60||iMW60", "imgK_frT60||iMW60")      '60 mm Holzständer mit 60 mm Faserdämmstoff
            Case "frT60||iMW40": Call Worksheets("Bauteilschichten").AddImg("imgB_frT60||iMW40", "imgK_frT60||iMW40")      '60 mm Holzständer mit 40 mm Faserdämmstoff
            Case "frT60||iMW140": Call Worksheets("Bauteilschichten").AddImg("imgB_frT60||iMW140", "imgK_frT60||iMW140")   '2 x 60 mm Holzständer, getrennt(20 mm Luft) mit 140 mm Faserdämmstoff
            Case "frT80||iMW80": Call Worksheets("Bauteilschichten").AddImg("imgB_frT80||iMW80", "imgK_frT80||iMW80")       '80 mm Holzständer mit 80 mm Faserdämmstoff
            Case "frT140||iMW120": Call Worksheets("Bauteilschichten").AddImg("imgB_frT140||iMW120", "imgK_frT140||iMW120")   '140 mm Holzständer mit 120 mm Faserdämmstoff
            Case "frT140||iMW140": Call Worksheets("Bauteilschichten").AddImg("imgB_frT140||iMW140", "imgK_frT140||iMW140")   '140 mm Holzständer mit 140 mm Faserdämmstoff
            Case "frT140||iMW70": Call Worksheets("Bauteilschichten").AddImg("imgB_frT140||iMW70", "imgK_frT140||iMW70")   '140 mm Holzständer mit 70 mm Faserdämmstoff
            
            'Metallständerwände
            Case "frM50||iMW40": Call Worksheets("Bauteilschichten").AddImg("imgB_frM50||iMW40", "imgK_frM50||iMW40") '50 mm CW Profil+40 mm Faserdämmstoff
            Case "frM75||iMW40": Call Worksheets("Bauteilschichten").AddImg("imgB_frM75||iMW40", "imgK_frM75||iMW40") '75 mm CW Profil+40 mm Faserdämmstoff
            Case "frM75||iMW60": Call Worksheets("Bauteilschichten").AddImg("imgB_frM75||iMW60", "imgK_frM75||iMW60") '75 mm CW Profil+60 mm Faserdämmstoff
            Case "frM100||iMW40": Call Worksheets("Bauteilschichten").AddImg("imgB_frM100||iMW40", "imgK_frM100||iMW40") '100 mm CW Profil+40 mm Faserdämmstoff
            Case "frM100||iMW60": Call Worksheets("Bauteilschichten").AddImg("imgB_frM100||iMW60", "imgK_frM100||iMW60") '100 mm CW Profil+60 mm Faserdämmstoff
            Case "frM100||iMW80": Call Worksheets("Bauteilschichten").AddImg("imgB_frM100||iMW80", "imgK_frM100||iMW80") '100 mm CW Profil+80 mm Faserdämmstoff
            Case "ac5": Call Worksheets("Bauteilschichten").AddImg("imgB_ac5", "imgK_ac5") '5mm Luftschicht mit Abstandshalter

            
            'Unterdecke oder Vorsatzschale
            Case "aC10": Call Worksheets("Bauteilschichten").AddImg("imgB_aC10", "imgK_aC10")                   '10 mm Luftschicht
            Case "aC20": Call Worksheets("Bauteilschichten").AddImg("imgB_aC20", "imgK_aC20")                   '20 mm Luftschicht
            Case "aC30": Call Worksheets("Bauteilschichten").AddImg("imgB_aC30", "imgK_aC30")                   '30 mm Luftschicht
            Case "frT24": Call Worksheets("Bauteilschichten").AddImg("imgB_frT24", "imgK_frT24")                '24 mm Lattung
            Case "frM27": Call Worksheets("Bauteilschichten").AddImg("imgB_frM27", "imgK_frM27")                '27 mm Federschiene
            Case "frM27||iMW25": Call Worksheets("Bauteilschichten").AddImg("imgB_frM27||iMW25", "imgK_frM27||iMW25")  '27 mm Federschiene + 25 mm MF
            Case "frM40f030": Call Worksheets("Bauteilschichten").AddImg("imgB_frM40f030", "imgK_frM40f030")    '40 mm Abhänger+ CD fo = 30 Hz
            Case "frM65f030": Call Worksheets("Bauteilschichten").AddImg("imgB_frM65f030", "imgK_frM65f030")    '65 mm Abhänger+ CD fo = 30 Hz
            Case "frM70f020": Call Worksheets("Bauteilschichten").AddImg("imgB_frM70f020", "imgK_frM70f020")    '70 mm Abhänger+ CD fo = 20 Hz
            Case "frM57f020": Call Worksheets("Bauteilschichten").AddImg("imgB_frM57f020", "imgK_frM57f020")    '57 mm Abhänger+ CD fo = 20 Hz
            Case "frT57f020": Call Worksheets("Bauteilschichten").AddImg("imgB_frT57f020", "imgK_frT57f020")    '57 mm Abhänger+ Lattung fo = 20 Hz
            Case "frT57f030": Call Worksheets("Bauteilschichten").AddImg("imgB_frT57f030", "imgK_frT57f030")    '57 mm Abhänger+ Lattung fo = 30 Hz
            Case "frM140f020": Call Worksheets("Bauteilschichten").AddImg("imgB_frM140f020", "imgK_frM140f020") '140 mm Abhänger+ 2xCD fo = 20 Hz
            Case "frM35": Call Worksheets("Bauteilschichten").AddImg("imgB_frM35", "imgK_frM35")                '35 mm Clip+ CD
            Case "frM90f030||iMW75"
                 Call Worksheets("Bauteilschichten").AddImg("imgB_frM90f030||iMW75", "imgK_frM90f030||iMW75")     '90 mm Abhänger+CD+75 mm Faserdämmstoff fo = 30 Hz
            Case "frM180f030||iMW120"
                 Call Worksheets("Bauteilschichten").AddImg("imgB_frM180f030||iMW120", "imgK_frM180f030||iMW120") '180 mm Abhänger+CD+120 mm Faserdämmstoff fo = 30 Hz
            Case "frM75||iMW75"
                 Call Worksheets("Bauteilschichten").AddImg("imgB_frM75||iMW75", "imgK_frM75||iMW75")           '75 mm CW Profil+75 mm Faserdämmstoff
            Case "frM75||iMW60"
                 Call Worksheets("Bauteilschichten").AddImg("imgB_frM75||iMW60", "imgK_frM75||iMW60")           '75 mm CW Profil+60 mm Faserdämmstoff
            Case "frT50||iMW40"
                If Schichten(inti + 1) = "bCLT90" Or Schichten(inti + 1) = "bCLT100" Then                                                      'offene Balkendecke
                    Call Worksheets("Bauteilschichten").AddImg("imgB_frT50_u||iMW40", "imgK_frT50||iMW40")      '50 mm Lattung mit Schwingbügel+40 mm Faserdämmstoff
                Else
                    Call Worksheets("Bauteilschichten").AddImg("imgB_frT50_o||iMW40", "imgK_frT50||iMW40")      '50 mm Lattung mit Schwingbügel+40 mm Faserdämmstoff
                End If
            Case "frT60||iMW50"
                If Schichten(inti + 1) = "bCLT90" Or Schichten(inti + 1) = "bCLT100" Then                                                      'offene Balkendecke
                    Call Worksheets("Bauteilschichten").AddImg("imgB_frT60_u||iMW50", "imgK_frT60||iMW50")      '60 mm Lattung mit Schwingbügel+50 mm Faserdämmstoff
                Else
                    Call Worksheets("Bauteilschichten").AddImg("imgB_frT60_o||iMW50", "imgK_frT60||iMW50")      '60 mm Lattung mit Schwingbügel+50 mm Faserdämmstoff
                End If
            Case "iMW50": Call Worksheets("Bauteilschichten").AddImg("imgB_iMW50", "imgK_iMW50")                '50 mm Faserdämmstoff
            Case "bGP10": Call Worksheets("Bauteilschichten").AddImg("imgB_bGP10", "imgK_bGP10")                '9,5 mm GK
            Case "bGP12": Call Worksheets("Bauteilschichten").AddImg("imgB_bGP12", "imgK_bGP12")                '12,5 mm GK
            Case "bGPF12": Call Worksheets("Bauteilschichten").AddImg("imgB_bGPF12", "imgK_bGPF12")             '12,5 mm GKF
            Case "bGPF15": Call Worksheets("Bauteilschichten").AddImg("imgB_bGPF15", "imgK_bGPF15")             '15 mm GKF
            Case "bGPF18": Call Worksheets("Bauteilschichten").AddImg("imgB_bGPF18", "imgK_bGPF18")             '18 mm GKF
            Case "bGF10": Call Worksheets("Bauteilschichten").AddImg("imgB_bGF10", "imgK_bGF10")                '10 mm GF
            Case "bGF12": Call Worksheets("Bauteilschichten").AddImg("imgB_bGF12", "imgK_bGF12")                '12,5 mm GF
            Case "bGF15": Call Worksheets("Bauteilschichten").AddImg("imgB_bGF15", "imgK_bGF15")                '15 mm GF
            Case "bGF18": Call Worksheets("Bauteilschichten").AddImg("imgB_bGF18", "imgK_bGF18")                '18 mm GF
            Case "bCB13": Call Worksheets("Bauteilschichten").AddImg("imgB_bCB13", "imgK_bCB13")                '13 mm Spanplatte
            Case "bOSB12": Call Worksheets("Bauteilschichten").AddImg("imgB_bOSB12", "imgK_bOSB12")             '12 mm Holzwerkstoffplatte
            Case "bOSB13": Call Worksheets("Bauteilschichten").AddImg("imgB_bOSB13", "imgK_bOSB13")             '13 mm Holzwerkstoffplatte
            Case "bOSB15": Call Worksheets("Bauteilschichten").AddImg("imgB_bOSB15", "imgK_bOSB15")             '15 mm Holzwerkstoffplatte


            'Schicht unbekannt
            Case Else: MsgBox ("Bauteilschicht nicht bekannt: " & Schichten(inti)): Exit Sub
            
        End Select
   Next
   
   'Bild Gruppieren und an der richtigen Stelle einfügen
   Call Worksheets("Bauteilschichten").Gruppieren

End Sub



''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''' Logarithmus zur Basis 10 berechnen                                     ''''''''''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Static Function Log10(X)
    Log10 = Log(X) / Log(10)
End Function


''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''' Maximum- und Minimumsuche                                              ''''''''''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Function max_(X, Y)
    max_ = WorksheetFunction.Max(X, Y)
End Function

Function min_(X, Y)
    min_ = WorksheetFunction.Min(X, Y)
End Function


''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''' PDF aus Tabellenblatt erzeugen und in Dialogbox anzeigen               ''''''''''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Sub PDF_Print_Sheet()
    
    Dim pfadPDF As String
    Dim test As Double
    Dim PauseTime, Start
    
    'Max. Wartezeit festlegen
    PauseTime = 30

    'Pfad für das pdf zusammensetzen
    pfadPDF = ActiveWorkbook.Path & "\" & "VBAcoustic_" & ActiveSheet.Name & "_" & VBA.Format(Now, "yyyy-mm-dd_hh.mm.ss") & ".pdf"
    
    'eventuel offene Datei schließen
    If frmVBAcousticTrenndecke.WebBrowserPDF.Visible = True Then Call pdfclose
    If frmVBAcousticTrennwand.WebBrowserPDF.Visible = True Then Call pdfclose

    'Debug Frame ausblenden
    If bDebug = True Then
        frmVBAcousticTrenndecke.frmDebugfunktionen.Visible = False
        frmVBAcousticTrennwand.frmDebug.Visible = False
    End If
    
    'PDF per Webbroser anzeigen
    On Error GoTo Standardviewer
    
 
    'Pfadlänge kontrollieren (Bei mehr als 200 Zeichen wird es instabil)
    If Len(pfadPDF) > 200 Then GoTo Standardviewer
    
    'PDF generieren und anzeigen
    ActiveSheet.ExportAsFixedFormat Type:=xlTypePDF, Filename:=pfadPDF, Quality:=xlQualityStandard, IncludeDocProperties:=True, IgnorePrintAreas:=False, OpenAfterPublish:=False
       
    If frmVBAcoustic.optHolzbau = True And frmVBAcoustic.optDecke = True Then
        If PDFextern = False Then
            With frmVBAcousticTrenndecke.WebBrowserPDF
                'Größe und Position des Webbrowsers festlegen
                .Top = 0                                                              'Position vom oberen Bildschirmrand festlegen
                .Height = frmVBAcousticTrenndecke.frmProgrammsteuerung.Height _
                - frmVBAcousticTrenndecke.frmValidierung.Height                       'Rahmenhöhe festlegen
                .Left = frmVBAcousticTrenndecke.frmValidierung.Left                   'Position vom linken Bildschirmrand festlegen
                .Width = frmVBAcousticTrenndecke.frmValidierung.Width
        
                'Webbrowser einblenden und pdf laden
                .Visible = True
                If Dir$(pfadPDF) <> vbNullString Then
                    .Navigate pfadPDF
                Else
                    GoTo Standardviewer
                End If
                
                'Warteschleife zum Laden des Dokuments
                Start = Timer
                Do: DoEvents: Loop Until (.ReadyState = 4 Or Timer > Start + PauseTime)
                
            End With
        Else
            GoTo Standardviewer
        End If

    
    ElseIf frmVBAcoustic.optHolzbau = True And frmVBAcoustic.optWand = True Then
        With frmVBAcousticTrennwand.WebBrowserPDF
            .Top = 0                                                    'Position vom oberen Bildschirmrand festlegen
            .Height = frmVBAcousticTrennwand.frmProgrammsteuerung.Height _
            - frmVBAcousticTrennwand.frmValidierung.Height                       'Rahmenhöhe festlegen
            
            .Left = frmVBAcousticTrennwand.frmValidierung.Left                   'Position vom linken Bildschirmrand festlegen
            .Width = frmVBAcousticTrennwand.frmValidierung.Width
                
            .Visible = True
            .Navigate ("about:blank")
            .Navigate pfadPDF
        End With
    
    End If
    
Exit Sub

'Absturz beim Öffnen des pdf im Wbbrowser abfangen -> pdf wird im Standard-Viewer geöffnet
Standardviewer:

    ActiveSheet.ExportAsFixedFormat Type:=xlTypePDF, Filename:=pfadPDF, Quality:=xlQualityStandard, IncludeDocProperties:=True, IgnorePrintAreas:=False, OpenAfterPublish:=True

End Sub


''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''' PDF im Browser schließen                                               ''''''''''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Sub pdfclose()

    If frmVBAcoustic.optHolzbau = True And frmVBAcoustic.optDecke = True Then
        frmVBAcousticTrenndecke.WebBrowserPDF.Navigate ("about:blank")
        frmVBAcousticTrenndecke.WebBrowserPDF.Visible = False
        If bDebug = True Then
            frmVBAcousticTrenndecke.frmDebugfunktionen.Visible = True 'Debug Frame wieder einblenden
        End If
    ElseIf frmVBAcoustic.optHolzbau = True And frmVBAcoustic.optWand = True Then
        frmVBAcousticTrennwand.WebBrowserPDF.Navigate ("about:blank")
        frmVBAcousticTrennwand.WebBrowserPDF.Visible = False
        If bDebug = True Then frmVBAcousticTrennwand.frmDebug.Visible = True 'Debug Frame wieder einblenden
    End If
    
    Application.Wait Now + TimeSerial(0, 0, 0.4) 'einmal Durchschnaufen damit er nicht hängen bleibt! :-)


End Sub


''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''' Datei in neuer Excel-Anwendung öffnen                           ''''''''''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Function openfile(Name As String) As Boolean

    'Deklarationen
    Dim strPfad As String
    
    'Pfad setzen
    strPfad = ActiveWorkbook.Path & "\" & Name
    
    If IsWorkbookOpen(Name) Then
        openfile = True
    ElseIf Dir(strPfad, vbNormal) = "" Then
        openfile = False
    Else
'        Set appExcel = CreateObject("Excel.Application")
'        With appExcel
'            .Visible = True
'            .Workbooks.Open Filename:=strPfad
'        End With
        Application.Workbooks.Open Filename:=strPfad
        openfile = True
    End If
End Function


''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''' Test ob Datei bereits geöffnet ist                                     ''''''''''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Function IsWorkbookOpen(strWB As String) As Boolean
   On Error Resume Next
   IsWorkbookOpen = Not Workbooks(strWB) Is Nothing
End Function


''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''' beliebiges Bild aus Tabellenblatt in jpg umwandeln                     ''''''''''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Sub Bild_exportieren()
    Dim myChartObject As ChartObject, myShape As Shape
    Dim bolfound As Boolean
    Application.ScreenUpdating = False
    For Each myShape In ActiveSheet.Shapes
        If myShape.Type = msoPicture Then bolfound = True: Exit For
    Next
    If bolfound Then
        myShape.CopyPicture Appearance:=xlScreen, Format:=xlPicture
        Worksheets.Add
        Set myChartObject = ActiveSheet.ChartObjects.Add(0, 0, myShape.Width, myShape.Height)
        With myChartObject
            .Activate
            .Chart.Paste
            .Chart.Export Filename:=ActiveWorkbook.Path & "\zwischenablage.jpg", FilterName:="JPG", Interactive:=False
        End With
        Application.DisplayAlerts = False
        ActiveSheet.Delete
        Application.DisplayAlerts = True
        Set myChartObject = Nothing
        Set myShape = Nothing
        Application.ScreenUpdating = True
    End If
End Sub




''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''' Userform an vorhandene Auflösung anpassen                     ''''''''''''''''''''''''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Public Sub SetDeviceIndependentWindow(FormName As Object)
  ' Diese Prozedur passt die Größe und Anordnung einer Userform
  ' an die jeweilige Auflösung an.
  ' Idee und Grundgerüst von Frank Lubitz
  '
  ' Im Prozeduraufruf muss die zu ändernde Userform angegeben werden
  Dim XFactor As Single     ' Horizontal resize ratio
  Dim YFactor As Single     ' Vertical resize ratio
  Dim X As Integer          ' For/Next loop variable
  Dim xPixels As Single
  Dim yPixels As Single
  Dim HeightChange As Long
  Dim WidthChange  As Long
  Dim OldHeight As Long
  Dim OldWidth  As Long
  Dim ctlControl As Control
  '
  ' Ausstieg, falls Skalierung unterdrückt wird
  'If bScaling = False Then Exit Sub
  
  ' Fehlermeldungen abfangen
  On Error GoTo ErrorHandler
  ' Vergrößerungs-/Verkleinerungsfaktor der aktuellen Auflösung
  ' in Bezug auf die ursprünglche Auflösung
  XFactor = intAppWidth / 1452
  YFactor = intAppHeight / 792
  
  'If XFactor < YFactor Then YFactor = XFactor Else XFactor = YFactor
  
  ' Keine Neuanordung bei identischer Auflösung
  If XFactor = 1 And YFactor = 1 Then Exit Sub
  ' Alte Einstellungen sichern
  OldHeight = FormName.Height
  OldWidth = FormName.Width
  ' Neue Abmessung der Userform berechnen
  FormName.Height = FormName.Height * YFactor
  FormName.Width = FormName.Width * XFactor
  ' Änderungen der Abmessungen
  HeightChange = FormName.Height - OldHeight
  WidthChange = FormName.Width - OldWidth
  ' Userform neu positionieren
  FormName.Left = FormName.Left - WidthChange / 2
  FormName.Top = FormName.Top - HeightChange / 2
  ' Alle Controls durchlaufen und ändern
  For Each ctlControl In FormName.Controls
    Debug.Print ctlControl.Name
    If TypeOf ctlControl Is ComboBox Then
      ' If Not a Simple Combo box
      ctlControl.FontSize = ctlControl.FontSize * XFactor
      If ctlControl.Style <> 1 Then
        ControlResize3 ctlControl, XFactor, YFactor
      End If
    ElseIf TypeOf ctlControl Is TextBox Then
      ControlResize ctlControl, XFactor, YFactor
    ElseIf TypeOf ctlControl Is Label Then
      ControlResize ctlControl, XFactor, YFactor
    ElseIf TypeOf ctlControl Is CheckBox Then
      ControlResize2 ctlControl, XFactor, YFactor
    ElseIf TypeOf ctlControl Is CommandButton Then
      ControlResize2 ctlControl, XFactor, YFactor
    ElseIf TypeOf ctlControl Is ListBox Then
      ControlResize ctlControl, XFactor, YFactor
    ElseIf TypeOf ctlControl Is Image Then
      ControlResize3 ctlControl, XFactor, YFactor
    ElseIf TypeOf ctlControl Is OptionButton Then
      ControlResize2 ctlControl, XFactor, YFactor
    ElseIf TypeOf ctlControl Is MultiPage Then
      ControlResize2 ctlControl, XFactor, YFactor
    ElseIf TypeOf ctlControl Is ToggleButton Then
      ControlResize2 ctlControl, XFactor, YFactor
    ElseIf TypeOf ctlControl Is SpinButton Then
      ControlResize3 ctlControl, XFactor, YFactor
    ElseIf TypeOf ctlControl Is ScrollBar Then
      ControlResize3 ctlControl, XFactor, YFactor
    Else
      ControlResize2 ctlControl, XFactor, YFactor
    End If
  Next ctlControl
  Exit Sub
ErrorHandler:
  ' try to handle next control
  Resume Next
End Sub

Function ControlResize(Control As Control, XFactor, YFactor)
  With Control
    .FontSize = .FontSize * XFactor
    .Move .Left * XFactor, .Top * YFactor, .Width * XFactor, .Height * YFactor
  End With
End Function

Function ControlResize2(Control As Control, XFactor, YFactor)
  With Control
    .Font.Size = .Font.Size * XFactor
    .Move .Left * XFactor, .Top * YFactor, .Width * XFactor, .Height * YFactor
  End With
End Function

Function ControlResize3(Control As Control, XFactor, YFactor)
  With Control
    If .Name = "ImgTitelbild1" Or .Name = "ImgTitelbild2" Then Exit Function
    .Move .Left * XFactor, .Top * YFactor, .Width * XFactor, .Height * YFactor
  End With
End Function


