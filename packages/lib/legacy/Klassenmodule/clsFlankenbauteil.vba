Option Explicit


'**********************************************************************************************************************************************************************************************
'# clsFlankenbauteil #
'
'**********************************************************************************************************************************************************************************************
'# Beschreibung / Vorgaben fuer die Klasse #
'
'   - Verwaltet alle Daten der Flankenbauteile
'   - Berechnet die Flankenübertragung
'
'**********************************************************************************************************************************************************************************************

'Eigenschaften
'##########################################################################################################################################################################################
Private m_FlankentypSR    As String
Private m_BeplankungSR    As String
Private m_WandmasseSR     As Double
Private m_WandmaterialSR  As String
Private m_FlaecheSR       As Double
Private m_lfSR            As Double
Private m_RwSR            As Double
Private m_DRwSR           As Double
Private m_DnfwSR          As Double
Private m_Quelle          As String


Private m_Stossstelle     As String
Private m_Stossversatz    As String
Private m_lVersatz        As Double
Private m_KijNorm         As String
Private m_KFf             As Double
Private m_KFd             As Double
Private m_KDf             As Double
Private m_K1              As Double
Private m_K2              As Double

Private m_FlankentypER    As String
Private m_BeplankungER    As String
Private m_WandmasseER     As Double
Private m_FlaecheER       As Double
Private m_WandmaterialER  As String
Private m_lfER            As Double
Private m_RwER            As Double
Private m_DRwER           As Double
Private m_DnfwER          As Double

Private m_RFfw            As Double
Private m_RDfw            As Double
Private m_RFdw            As Double
Private m_LnDfw           As Double
Private m_LnDFfw          As Double


'Methoden
'##########################################################################################################################################################################################
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''' Daten in Klasse übertragen                                                                   ''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Sub Dateninput()
    If frmVBAcoustic.optDecke = True And frmVBAcoustic.optHolzbau = True Then
        With frmVBAcousticTrenndecke
            m_FlankentypSR = .cboWandtyp.Text                                              'Wandtyp der oberen Wand
            m_BeplankungSR = .cboBeplankung.Text                                           'raumseitige Beplankung der oberen Holzständerwand
            m_WandmasseSR = IIf(IsNumeric(.txtMasseWand), .txtMasseWand, 0)                'flächenbezogene Masse der Massivholzwand + Beplankung
            m_lfSR = IIf(IsNumeric(.txtlfSR), .txtlfSR, 0)                                 'Gemeinsame Kantenlänge der oberen Wand
            m_RwSR = IIf(IsNumeric(.txtRwWand), .txtRwWand, 0)                             'Schalldämmung der flankierenden Wand im Senderaum
            m_DRwSR = IIf(IsNumeric(.txtDRwSR), .txtDRwSR, 0)                              'Verbesserung durch Vorsatzschalen im Senderaum
            m_DnfwSR = IIf(IsNumeric(.txtDnfwSR), .txtDnfwSR, 0)                           'Norm-Flankenpegeldifferenz Holzständerwand
            
            m_Stossstelle = .cboStossstelle.Text                                           'Art der Stoßstelle
            m_KFf = IIf(IsNumeric(.txtKFf), .txtKFf, 0)                                    'Stoßstellendämm-Maß Weg Ff
            m_KFd = IIf(IsNumeric(.txtKFd), .txtKFd, 0)                                    'Stoßstellendämm-Maß Weg Fd
            m_KDf = IIf(IsNumeric(.txtKDf), .txtKDf, 0)                                    'Stoßstellendämm-Maß Weg Df
            
            If .chkSymmetrie.Value = True Then
                m_FlankentypER = .cboWandtyp.Text                                          'Wandtyp der unteren Wand
                m_BeplankungER = .cboBeplankung.Text                                       'raumseitige Beplankung der unteren Holzständerwand
                m_WandmasseER = IIf(IsNumeric(.txtMasseWand), .txtMasseWand, 0)            'flächenbezogene Masse der Massivholzwand + Beplankung
                m_lfER = IIf(IsNumeric(.txtlfSR), .txtlfSR, 0)                              'Gemeinsame Kantenlänge der oberen Wand
                m_RwER = IIf(IsNumeric(.txtRwWand), .txtRwWand, 0)                         'Schalldämmung der flankierenden Wand im Empfangsraum
                m_DRwER = IIf(IsNumeric(.txtDRwER), .txtDRwER, 0)                          'Verbesserung durch Vorsatzschalen im Empfangsraum
                m_DnfwER = IIf(IsNumeric(.txtDnfwSR), .txtDnfwSR, 0)                       'Norm-Flankenpegeldifferenz Holzständerwand
            Else
                m_FlankentypER = .cboWandtypER.Text                                        'Wandtyp der unteren Wand
                m_BeplankungER = .cboBeplankungER.Text                                     'raumseitige Beplankung der unteren Holzständerwand
                m_WandmasseER = IIf(IsNumeric(.txtMasseWandER), .txtMasseWandER, 0)        'flächenbezogene Masse der Massivholzwand + Beplankung
                m_lfER = IIf(IsNumeric(.txtlfER), .txtlfER, 0)                             'Gemeinsame Kantenlänge der oberen Wand
                m_RwER = IIf(IsNumeric(.txtRwWandER), .txtRwWandER, 0)                     'Schalldämmung der flankierenden Wand im Empfangsraum
                m_DRwER = IIf(IsNumeric(.txtDRwER), .txtDRwER, 0)                          'Verbesserung durch Vorsatzschalen im Empfangsraum
                m_DnfwER = IIf(IsNumeric(.txtDnfwER), .txtDnfwER, 0)                       'Norm-Flankenpegeldifferenz Holzständerwand
            End If
        End With
    
    ElseIf frmVBAcoustic.optWand = True And frmVBAcoustic.optHolzbau = True Then
        With frmVBAcousticTrennwand
            
            m_FlankentypSR = .cboFlankentyp                                                'Flankentyp im Senderaum
            m_WandmasseSR = IIf(IsNumeric(.txtmstrichFlanke), .txtmstrichFlanke, 0)        'flächenbezogene Masse der Flanke
            m_WandmaterialSR = .cboMaterial                                                'Baumerterial der Flanke
            m_lfSR = IIf(IsNumeric(.txtlf), .txtlf, 0)                                     'Gemeinsame Kantenlänge Trennwand/Flanke
            m_FlaecheSR = IIf(IsNumeric(.txtS1_Flanke), .txtS1_Flanke, 0)                  'Fläche der Flanke im Senderaume
            m_FlaecheER = IIf(IsNumeric(.txtS2_Flanke), .txtS2_Flanke, 0)                  'Fläche der Flanke im Empfangsraum
            m_RwSR = IIf(IsNumeric(.txtRwFlanke), .txtRwFlanke, 0)                         'Schalldämmung der senderaumseitigen Flanke
            m_DnfwSR = IIf(IsNumeric(.txtDnfwFlanke), .txtDnfwFlanke, 0)                   'Norm-Flankenpegeldifferenz Holzständer-/Metallständerwand
            m_DnfwER = IIf(IsNumeric(.txtDnfwFlanke), .txtDnfwFlanke, 0)                   'Norm-Flankenpegeldifferenz Holzständer-/Metallständerwand
            
            m_DRwSR = IIf(IsNumeric(.txtDRwSR_Flanke), .txtDRwSR_Flanke, 0)                'Verbesserung durch Vorsatzschalen im Senderaum
            m_DRwER = IIf(IsNumeric(.txtDRwER_Flanke), .txtDRwER_Flanke, 0)                'Verbesserung durch Vorsatzschalen im Empfangsraum
            
            If clsWand(1).Raumanordnung <> DIAGONAL Then                                   'Bei Diagonaler Raumanordnung erfolgt die Übergabe direkt
                m_KijNorm = .cboStossstellenGrundlage                                      'Normative Grundlage
                m_KFf = IIf(IsNumeric(.txtKFf), .txtKFf, -1000)                            'Stoßstellendämm-Maß Weg Ff
                m_KFd = IIf(IsNumeric(.txtKFd), .txtKFd, -1000)                            'Stoßstellendämm-Maß Weg Fd
                m_KDf = IIf(IsNumeric(.txtKDf), .txtKDf, -1000)                            'Stoßstellendämm-Maß Weg Df
            End If
            
            If .chkSymmetrie.Value = True Then
                m_FlankentypER = m_FlankentypSR                                            'Wandtyp der unteren Wand
                m_WandmasseER = m_WandmasseSR                                              'flächenbezogene Masse der Massivholzwand + Beplankung
                m_WandmaterialER = m_WandmaterialSR                                        'Material der flankierenden Massivwand
                m_lfER = m_lfSR                                                            'Gemeinsame Kantenlänge der oberen Wand
                m_RwER = m_RwSR                                                            'Schalldämmung der flankierenden Wand im Empfangsraum
                m_DnfwER = m_DnfwSR                                                        'Norm-Flankenpegeldifferenz Holzständerwand
            
            ElseIf m_Stossversatz <> "" Then
                m_lVersatz = IIf(IsNumeric(.txtlVersatz), .txtlVersatz, 0)
                m_FlankentypER = "nv"                                                       'Bei versetzten Stößen bildet die Fortsezung der Trennwand die Flanke
                m_lfER = m_lfSR
                
                
            If (m_Stossversatz = WAND_LINKS_AUSSEN Or m_Stossversatz = WAND_RECHTS_AUSSEN) Then
                m_RwER = clsWand(1).Rsw
            ElseIf (m_Stossversatz = WAND_LINKS_INNEN Or m_Stossversatz = WAND_RECHTS_INNEN) Then
                m_RwER = m_RwSR
            End If
                
                
            Else
                'Unsymmetrie noch nicht vorgesehen
            End If
        End With
    End If
End Sub

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''' Daten auf Vollständigkeit überprüfen                                                         ''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
 Function checkdata_Flanke() As Boolean
    
    'lokale Variablen deklarieren
    Dim IsError As Boolean
    IsError = False

    'Daten für Trenndeckenecken im Holzbau auf Vollständigkeit überprüfen
    If frmVBAcoustic.optDecke = True And frmVBAcoustic.optHolzbau = True Then
    
         If m_FlankentypSR = "" Or m_FlankentypER = "" Or m_lfSR = 0 Or m_lfER = 0 Then
             IsError = True
             
         'für Flanke = Holzständerwand "HSTW" muss ein Beplankungstyp angegeben sein
         ElseIf (m_FlankentypSR = HSTW And m_BeplankungSR = "") Or (m_FlankentypER = HSTW And m_BeplankungER = "") Then
             IsError = True
             
         'für Flanke = Holzständerwand "HSTW" muss Dnfw vorhanden sein
         ElseIf (m_FlankentypSR = HSTW And m_DnfwSR = 0) Or (m_FlankentypER = HSTW And m_DnfwER = 0) Then
             IsError = True
             
         'für Flanke = Masivholzwand "MHW" muss für die differenzierte Berechnung ein KFf vorhanden sein
         ElseIf m_FlankentypSR = MHW And bDIN4109 = False And (m_Stossstelle = "" Or m_KFf = 0) Then
             IsError = True
             
         'für Flanke = Masivholzwand "MHW" muss für die differenzierte Berechnung Rw und m' vorhanden sein
         ElseIf m_FlankentypSR = MHW And bDIN4109 = False And (m_RwSR = 0 Or m_RwER = 0 Or m_WandmasseSR = 0 Or m_WandmasseSR = 0) Then
             IsError = True
        
         End If
         
    'Flanken-Daten für Trennwände im Holzbau auf Vollständigkeit überprüfen
    ElseIf frmVBAcoustic.optWand = True And frmVBAcoustic.optHolzbau = True Then
         
        If m_FlankentypSR = "" Or m_FlankentypER = "" Or m_lfSR = 0 Or m_lfER = 0 Then
             IsError = True
    
        'Check für Leichtbau-Flanken
        ElseIf (m_FlankentypSR = HSTW Or m_FlankentypSR = MSTW Or m_FlankentypSR = HBD Or _
             m_FlankentypSR = HB_FLACHD Or m_FlankentypSR = SP_STEILD) Then
             
             If (m_DnfwSR = 0 Or m_DnfwER = 0) And m_Stossversatz = "" Then IsError = True
        
        'Check für Massivbau- und Massivholzbau Flanken
        Else
        
            If (m_RwSR = 0 Or m_RwER = 0) Then IsError = True
            If m_KFf = -1000 Then IsError = True
        
        End If
        
        'Check für versetzte Flanken
        If (m_Stossversatz = WAND_LINKS_AUSSEN Or m_Stossversatz = WAND_RECHTS_AUSSEN) Then
            
            If m_KDf = -1000 Then IsError = True
        
        ElseIf (m_Stossversatz = WAND_LINKS_INNEN Or m_Stossversatz = WAND_RECHTS_INNEN) Then
        
            If m_KFd = -1000 Then IsError = True
        
        End If
        
    End If
    
    
    'Rückgabewert
    If IsError = True Then
        checkdata_Flanke = False
    Else
        checkdata_Flanke = True
    End If
    
 End Function
 
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''' Flankendämm-Maße Rijw berechnen                                                              ''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
 Sub Rijw_Flanke(Trennbauteil As String, Rw As Double, Rsw As Double, DRwi As Double, DRwj As Double, lo As Double, Ss As Double)

    'Variablen deklarieren
    Dim DRijw As Double
    Dim temp As Double
    
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    ' Berechnung der Übertragung flankierender Bauteile von Holzbau-Trenndecken   '
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    If frmVBAcoustic.optDecke = True And frmVBAcoustic.optHolzbau = True Then

        'Flankendämm-Maß für Massivholz-Flanken (Massivholzwand = MHW)
        If (m_FlankentypSR = MHW And m_FlankentypER = MHW) Or _
           (m_FlankentypSR = MHE And m_FlankentypER = MHE) Then
            
            If bDIN4109 = True Then Exit Sub 'Berechnung nach DIN 4109 nicht möglich
            
            DRijw = calcDRijw(m_DRwSR, m_DRwER)
            m_RFfw = (m_RwER + m_RwSR) / 2 + DRijw + m_KFf + 10 * Log10(Ss / m_lfSR)
            
            If Trennbauteil = MHD Or _
               Trennbauteil = MHD_UD Or _
               Trennbauteil = MHD_HBV Or _
               Trennbauteil = MHD_RIPPEN_KASTEN Then
               
                DRijw = calcDRijw(DRwi, m_DRwER)
                m_RDfw = (Rsw + m_RwER) / 2 + DRijw + m_KDf + 10 * Log10(Ss / m_lfSR)
                
                DRijw = calcDRijw(m_DRwSR, DRwj)
                m_RFdw = (m_RwSR + Rsw) / 2 + DRijw + m_KFd + 10 * Log10(Ss / m_lfSR)
            Else
                m_RDfw = 0
                m_RFdw = 0
            End If
            
        'Flankendämm-Maß für Leichtbau-Flanken
        Else
            
            DRijw = calcDRijw(m_DRwSR, m_DRwER)
            m_RFfw = m_DnfwSR + 10 * Log10(Ss / 10) + 10 * Log10(lo / m_lfSR) + DRijw
            m_RDfw = 0
            m_RFdw = 0
        End If

    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    ' Berechnung der Übertragung flankierender Bauteile von Leichtbau-Trennwänden '
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    ElseIf frmVBAcoustic.optWand = True And frmVBAcoustic.optHolzbau = True Then
        
        'Flankendämm-Maß für massive Flanken oder Massivholz-Flanken
        If (m_FlankentypSR = SBD Or m_FlankentypSR = MHD Or _
           m_FlankentypSR = SB_FlACHD Or m_FlankentypSR = MH_FLACHD Or _
           m_FlankentypSR = MHW Or m_FlankentypSR = MW) Then
            
            DRijw = calcDRijw(m_DRwSR, m_DRwER)
            m_RFfw = (m_RwER + m_RwSR) / 2 + DRijw + m_KFf + 10 * Log10(Ss / m_lfSR)
            
            If (Trennbauteil = MHW) And (m_FlankentypSR = MHD Or m_FlankentypSR = MH_FLACHD Or m_FlankentypSR = MHW) Then
                
'                If clsWand(1).Anwendungstyp = WTW_2 Then '2. TW-Schale als VS bei versetzten Stößen richtig anordnen
'                    If (m_Stossversatz = WAND_LINKS_AUSSEN Or m_Stossversatz = WAND_RECHTS_AUSSEN) And DRwi > DRwj Then
'                        temp = DRwj: DRwj = DRwi: DRwi = temp
'                    ElseIf (m_Stossversatz = WAND_LINKS_INNEN Or m_Stossversatz = WAND_RECHTS_INNEN) And DRwj > DRwi Then
'                        temp = DRwi: DRwi = DRwj: DRwj = temp
'                    End If
'                End If
            
                DRijw = calcDRijw(DRwi, m_DRwER)
                m_RDfw = (Rsw + m_RwER) / 2 + DRijw + m_KDf + 10 * Log10(Ss / m_lfSR)
                
                DRijw = calcDRijw(m_DRwSR, DRwj)
                m_RFdw = (m_RwSR + Rsw) / 2 + DRijw + m_KFd + 10 * Log10(Ss / m_lfSR)
            Else
                m_RDfw = 0
                m_RFdw = 0
            End If
           
        'Flankendämm-Maß für Leichtbau-Flanken
        Else
            If m_Stossversatz = "" Then 'Flanke ohne Stossversatz
                DRijw = calcDRijw(m_DRwSR, m_DRwER)
                m_RFfw = m_DnfwSR + 10 * Log10(Ss / 10) + 10 * Log10(lo / m_lfSR) + DRijw
            Else
                m_RFfw = 0
            End If
            m_RDfw = 0
            m_RFdw = 0
        End If
        
        'Stossversatz <> "": Umsortierung für den Sonderfall der versetzten flankierenden Wand
        If m_Stossversatz = WAND_LINKS_AUSSEN Or m_Stossversatz = WAND_RECHTS_AUSSEN Then
            m_RFfw = m_RFdw
            DRijw = calcDRijw(DRwi, DRwj)
            m_RDfw = Rw + m_KDf + 10 * Log10(Ss / m_lfSR)
            
        ElseIf m_Stossversatz = WAND_LINKS_INNEN Or m_Stossversatz = WAND_RECHTS_INNEN Then
            m_RFfw = m_RDfw
            DRijw = calcDRijw(DRwi, DRwj)
            m_RFdw = Rw + m_KFd + 10 * Log10(Ss / m_lfSR)
        
        End If

    End If

End Sub

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''' Trittschall-Flankenübertragung Lnijw berechnen                                               ''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Sub Lnijw_Flanke(Deckentyp As String, Estrichaufbau As String, Lnw As Double, DLUnterdecke As Double, Ss As Double)

    'Variablen deklarieren
    Dim DRijw As Double             'Verbesserung durch Vorsatzschalen und Zusatzbeplankung
    Dim DKij As Double              'Verbesserung durch Elastomer

    
    '''  Für den Übertragungsweg Df:   LnDfw  '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    If (m_FlankentypSR = MHW And m_FlankentypER = MHW) Then 'Massivholzwände "MHW"
    
        '''  Korektursummand K1 für Weg Df berechnen
        m_K1 = calcK1(Deckentyp, m_FlankentypER)
        
        If bDIN4109 = False Then
            'Verbesserung durch Vorsatzschalen und Zusatzbeplankung auf der Empfangsraumwand ermitteln
            DRijw = m_DRwER / 2 + max_((m_RwER - Rw_HB(63)) / 2, 0)
            
            'Verbesserung durch Elastomere im Deckenstoß ermitteln
            If Deckentyp = MHD Or Deckentyp = MHD_UD Or _
               Deckentyp = MHD_HBV Or Deckentyp = MHD_RIPPEN_KASTEN Then

                DKij = m_KDf - Kij_HB(m_KijNorm, T_STOSS, "Df", "vertikal", 0, 0)
                
            End If
            
            'Bei Massivholzdecken mit Unterdecken wird die Unterdecke für den Weg Df herausgerechnet
            If Deckentyp = MHD_UD Then Lnw = Lnw + DLUnterdecke
            
            'LnDfw berechnen
            m_LnDfw = 10 * Log10(10 ^ (0.1 * (Lnw + m_K1)) - 10 ^ (0.1 * Lnw)) - 10 * Log10(Ss / m_lfSR) - DRijw - DKij
            
        End If
    
    Else 'Leichtbau
    
        '''  Korektursummand K1 für Weg Df berechnen
        m_K1 = calcK1(Deckentyp, m_BeplankungER)
    
        If bDIN4109 = False Then
            'Verbesserung durch Vorsatzschalen auf der Empfangsraumwand
            DRijw = m_DRwER / 2
            
            'Bei Massivholzdecken mit Unterdecken wird die Unterdecke für den Weg Df herausgerechnet
            If Deckentyp = MHD_UD Then Lnw = Lnw + clsDecke(1).DLUnterdecke

            'LnDfw berechnen
            m_LnDfw = 10 * Log10(10 ^ (0.1 * (Lnw + m_K1)) - 10 ^ (0.1 * Lnw)) - 10 * Log10(Ss / m_lfSR) - DRijw
        End If
        
    End If
    
    
    '''  Für den Übertragungsweg DFf:   LnDFfw  '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    If (m_FlankentypSR = MHW And m_FlankentypER = MHW) Then 'Massivholzwände "MHW"
    
        ' Korektursummand K2 für Weg DFf berechnen
        m_K2 = calcK2(Lnw, m_FlankentypSR, Estrichaufbau)
    
        If bDIN4109 = False Then
            'Verbesserung durch Vorsatzschalen und Zusatzbeplankungen ermitteln
            DRijw = m_DRwER / 2 + m_DRwSR / 2 + max_((m_RwSR - Rw_HB(63)) / 2, 0) + max_((m_RwER - Rw_HB(63)) / 2, 0)
            
            'Verbesserung durch Elastomere im Deckenstoß ermitteln
            DKij = m_KFf - Kij_HB(m_KijNorm, T_STOSS, "Ff", "vertikal", 0, 0)
            
            'LnDFfw berechnen
                    
            If Estrichaufbau = ZE_MF Then 'Zementestrich auf Mineralfaser
                    m_LnDFfw = 45 - 10 * Log10(Ss / m_lfSR) - DRijw - DKij
                    
            ElseIf Estrichaufbau = ZE_WF Then 'Zementestrich auf Holzfaser
                    m_LnDFfw = 46 - 10 * Log10(Ss / m_lfSR) - DRijw - DKij
                    
            ElseIf Estrichaufbau = TE Then 'Trockenestrich
                    m_LnDFfw = 42 - 10 * Log10(Ss / m_lfSR) - DRijw - DKij
                    
            End If
            
        End If
    
    Else 'Leichtbau
    
        ' Korektursummand K2 für Weg DFf berechnen
        m_K2 = calcK2(Lnw, m_BeplankungSR, Estrichaufbau)
        
        If bDIN4109 = False Then
            'Verbesserung durch Vorsatzschalen ermitteln
            DRijw = m_DRwER / 2 + m_DRwSR / 2
    
            If m_BeplankungSR = HWST_GK Or m_BeplankungSR = GF Then
            
                        
                If Estrichaufbau = ZE_MF Then 'Zementestrich auf Mineralfaser
                    m_LnDFfw = 40 - 10 * Log10(Ss / m_lfSR) - DRijw
                    
                ElseIf Estrichaufbau = ZE_WF Then 'Zementestrich auf Holzfaser
                    m_LnDFfw = 44 - 10 * Log10(Ss / m_lfSR) - DRijw

                    
                ElseIf Estrichaufbau = TE Then 'Trockenestrich
                    m_LnDFfw = 38 - 10 * Log10(Ss / m_lfSR) - DRijw
                    
                End If
                
            ElseIf m_BeplankungSR = HWST Then
            
                If Estrichaufbau = ZE_MF Then 'Zementestrich auf Mineralfaser
                    m_LnDFfw = 45 - 10 * Log10(Ss / m_lfSR) - DRijw
                    
                ElseIf Estrichaufbau = ZE_WF Then 'Zementestrich auf Holzfaser
                    m_LnDFfw = 46 - 10 * Log10(Ss / m_lfSR) - DRijw
                    
                ElseIf Estrichaufbau = TE Then 'Trockenestrich
                    m_LnDFfw = 42 - 10 * Log10(Ss / m_lfSR) - DRijw
                    
                End If
                
            Else
                'Falsche Wandbeplankung
                m_LnDFfw = 1000
    
                
            End If
            
        End If
        
    End If
    

End Sub

Function calcK1(Deckentyp As String, Beplankung As String) As Double

'-------------------------------------------------------------------------------'
'--- Ermittelt den Korektursumanden K1 für den Weg Df  -------------------------'
'-------------------------------------------------------------------------------'
If Deckentyp = HBD_ABH_2GK Then '"Holzbalkendecke mit Abh. + 2 x GK"
        
        Select Case Beplankung
        Case HWST_GK: calcK1 = 6
        Case GF: calcK1 = 7
        'Für Massivholzwände "MHW" oder Beplankung aus Holzwerkstoffplatten
        Case MHW, HWST: calcK1 = 9
        End Select
        
ElseIf Deckentyp = HBD_ABH_GK Then '"Holzbalkendecke mit FS + 1 x GK"
        
        Select Case Beplankung
        Case HWST_GK: calcK1 = 3
        Case GF: calcK1 = 4
        'Für Massivholzwände "MHW" oder Beplankung aus Holzwerkstoffplatten
        Case MHW, HWST: calcK1 = 5
        End Select
        
ElseIf Deckentyp = HBD_OFFEN Or _
       Deckentyp = HBD_L_GK Or _
       Deckentyp = MHD Or _
       Deckentyp = MHD_UD Or _
       Deckentyp = MHD_RIPPEN_KASTEN Or _
       Deckentyp = MHD_HBV Then 'alle Deckentypen ohne (oder mit starrer) Unterdecke
        
        Select Case Beplankung
        Case HWST_GK: calcK1 = 1
        Case GF: calcK1 = 1
        'Für Massivholzwände "MHW" oder Beplankung aus Holzwerkstoffplatten
        Case MHW, HWST: calcK1 = 4
        End Select

Else
        calcK1 = 1000
  
End If


End Function


'-------------------------------------------------------------------------------'
'--- Ermittelt den Korektursumanden K2 für den Weg DFf  -------------------------'
'-------------------------------------------------------------------------------'
Function calcK2(Lnw As Double, Beplankung As String, Estrichaufbau As String) As Double

Dim arrK2
Dim intcol As Integer
Dim intRow As Integer

arrK2 = Array(10, 9, 8, 7, 6, 5, 5, 4, 4, 3, 3, 2, 2, 1, 1, 1, 1, 1, 1, 0, 0, 0, _
              6, 5, 5, 4, 4, 3, 3, 2, 2, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, _
              6, 4, 4, 3, 3, 2, 2, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, _
              11, 10, 10, 9, 8, 7, 6, 5, 5, 4, 4, 3, 3, 2, 2, 1, 1, 1, 1, 1, 1, 0, _
              10, 10, 9, 8, 7, 6, 5, 5, 4, 4, 3, 3, 2, 2, 1, 1, 1, 1, 1, 1, 0, 0, _
              8, 7, 6, 5, 5, 4, 4, 3, 3, 2, 2, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0)
              
'Spalte in K2 Matrix festlegen
intcol = CInt(Lnw) + CInt(m_K1) - 35
intcol = IIf(intcol < 0, 0, intcol)
intcol = IIf(intcol > 21, 21, intcol)
              
'Zeile in K2 Matrix festlegen
Select Case Beplankung

        Case HWST_GK, GF
             If Estrichaufbau = ZE_MF Then intRow = 1 '"Zementestrich auf Mineralfaser"
             If Estrichaufbau = ZE_WF Then intRow = 0 '"Zementestrich auf Holzfaser"
             If Estrichaufbau = TE Then intRow = 2 '"Trockenestrich"
        
        'Für Massivholzwände "MHW" oder Beplankung aus Holzwerkstoffplatten
        Case MHW, HWST
             If Estrichaufbau = ZE_MF Then intRow = 4 '"Zementestrich auf Mineralfaser"
             If Estrichaufbau = ZE_WF Then intRow = 3 '"Zementestrich auf Holzfaser"
             If Estrichaufbau = TE Then intRow = 5 '"Trockenestrich"

End Select

calcK2 = arrK2(intRow * 22 + intcol)
              
End Function







'Eigenes Initialize-Event
'++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
Private Sub Class_Initialize()
    
    
End Sub

'Propertys abrufen
'++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
Property Get FlankentypSR() As String

    FlankentypSR = m_FlankentypSR

End Property

Property Get BeplankungSR() As String

    BeplankungSR = m_BeplankungSR

End Property

Property Get RwSR() As Double

    RwSR = m_RwSR

End Property

Property Get WandmasseSR() As Double

    WandmasseSR = m_WandmasseSR

End Property

Property Get WandmaterialSR() As String

    WandmaterialSR = m_WandmaterialSR

End Property

Property Get lfSR() As Double

    lfSR = m_lfSR

End Property

Property Get FlaecheSR() As Double

    FlaecheSR = m_FlaecheSR

End Property

Property Get DRwSR() As Double

    DRwSR = m_DRwSR

End Property

Property Get DnfwSR() As Double

    DnfwSR = m_DnfwSR

End Property

Property Get Quelle() As String

    Quelle = m_Quelle

End Property

Property Get Stossstelle() As String

    Stossstelle = m_Stossstelle

End Property

Property Get Stossversatz() As String

    Stossversatz = m_Stossversatz

End Property
Property Get lVersatz() As Double

    lVersatz = m_lVersatz

End Property

Property Get KijNorm() As String

    KijNorm = m_KijNorm

End Property

Property Get KFf() As Double

    KFf = m_KFf

End Property

Property Get KFd() As Double

    KFd = m_KFd

End Property

Property Get KDf() As Double

    KDf = m_KDf

End Property

Property Get K1() As Double

    K1 = m_K1

End Property

Property Get K2() As Double

    K2 = m_K2

End Property
Property Get FlankentypER() As String

    FlankentypER = m_FlankentypER

End Property

Property Get BeplankungER() As String

    BeplankungER = m_BeplankungER

End Property

Property Get RwER() As Double

    RwER = m_RwER

End Property

Property Get WandmasseER() As Double

    WandmasseER = m_WandmasseER

End Property

Property Get lfER() As Double

    lfER = m_lfER

End Property

Property Get FlaecheER() As Double

    FlaecheER = m_FlaecheER

End Property

Property Get DRwER() As Double

    DRwER = m_DRwER

End Property

Property Get RFfw() As Double

    RFfw = m_RFfw

End Property

Property Get RDfw() As Double

    RDfw = m_RDfw

End Property

Property Get RFdw() As Double

    RFdw = m_RFdw

End Property

Property Get DnfwER() As Double

    DnfwER = m_DnfwER

End Property

Property Get LnDfw() As Double

    LnDfw = m_LnDfw

End Property

Property Get LnDFfw() As Double

    LnDFfw = m_LnDFfw

End Property


'Propertys setzen
'++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
Public Property Let FlankentypSR(strFlankentypSR As String)

    m_FlankentypSR = strFlankentypSR

End Property

Public Property Let BeplankungSR(strBeplankungSR As String)

    m_BeplankungSR = strBeplankungSR

End Property

Public Property Let DRwSR(dblDRwSR As Double)
    
    m_DRwSR = dblDRwSR

End Property

Public Property Let RwSR(dblRwSR As Double)
    
    m_RwSR = dblRwSR

End Property

Public Property Let WandmasseSR(dblWandmasseSR As Double)
    
    m_WandmasseSR = dblWandmasseSR

End Property

Public Property Let WandmaterialSR(strWandmaterialSR As String)

    m_WandmaterialSR = strWandmaterialSR

End Property


Public Property Let lfSR(dbllfSR As Double)
    
    m_lfSR = dbllfSR

End Property

Public Property Let FlaecheSR(dblFlaecheSR As Double)

    m_FlaecheSR = dblFlaecheSR

End Property


Public Property Let DnfwSR(dblDnfwSR As Double)
    
    m_DnfwSR = dblDnfwSR

End Property

Public Property Let Quelle(strQuelle As String)

    m_Quelle = strQuelle

End Property

Public Property Let Stossstelle(strStossstelle As String)

    m_Stossstelle = strStossstelle

End Property

Public Property Let Stossversatz(strStossversatz As String)

    m_Stossversatz = strStossversatz

End Property
Public Property Let lVersatz(dbllVersatz As Double)

    m_lVersatz = dbllVersatz

End Property


Public Property Let KijNorm(strKijNorm As String)

    m_KijNorm = strKijNorm

End Property

Public Property Let KFf(dblKFf As Double)
    
    m_KFf = dblKFf

End Property

Public Property Let KFd(dblKFd As Double)
    
    m_KFd = dblKFd

End Property

Public Property Let KDf(dblKDf As Double)
    
    m_KDf = dblKDf

End Property

Public Property Let K1(dblK1 As Double)
    
    m_K1 = dblK1

End Property

Public Property Let K2(dblK2 As Double)
    
    m_K2 = dblK2

End Property

Public Property Let FlankentypER(strFlankentypER As String)

    m_FlankentypER = strFlankentypER

End Property

Public Property Let BeplankungER(strBeplankungER As String)

    m_BeplankungER = strBeplankungER

End Property

Public Property Let DRwER(dblDRwER As Double)
    
    m_DRwER = dblDRwER

End Property

Public Property Let RwER(dblRwER As Double)
    
    m_RwER = dblRwER

End Property

Public Property Let WandmasseER(dblWandmasseER As Double)
    
    m_WandmasseER = dblWandmasseER

End Property


Public Property Let lfER(dbllfER As Double)
    
    m_lfER = dbllfER

End Property

Public Property Let FlaecheER(dblFlaecheER As Double)

    m_FlaecheER = dblFlaecheER

End Property


Public Property Let DnfwER(dblDnfwER As Double)
    
    m_DnfwER = dblDnfwER

End Property

Public Property Let RFfw(dblRFfw As Double)
    
    m_RFfw = dblRFfw

End Property

Public Property Let RDfw(dblRDfw As Double)
    
    m_RDfw = dblRDfw

End Property

Public Property Let RFdw(dblRFdw As Double)
    
    m_RFdw = dblRFdw

End Property


Public Property Let LnDfw(dblLnDfw As Double)
    
    m_LnDfw = dblLnDfw

End Property


Public Property Let LnDFfw(dblLnDFfw As Double)
    
    m_LnDFfw = dblLnDFfw

End Property



