Option Explicit

'**********************************************************************************************************************************************************************************************
'# clsTrennwand#
'
'**********************************************************************************************************************************************************************************************
'# Beschreibung / Vorgaben fuer die Klasse #
'
'   - Verwaltet alle Daten der Trennwand
'   - Berechnet die Luftschalldämmung inklusive Flankenübertagung
'
'**********************************************************************************************************************************************************************************************

'Eigenschaften
'##########################################################################################################################################################################################
Private m_Wandtyp                 As String
Private m_Anwendungstyp           As String
Private m_Rw                      As Double
Private m_Rsw                     As Double
Private m_Raumbreite              As Double
Private m_Raumhoehe               As Double
Private m_Quelle_Tbt              As String
Private m_RStrichw                As Double
Private m_Raumanordnung           As String
Private m_Flaeche                 As Double
Private m_DRw_SR                  As Double
Private m_DRw_ER                  As Double
Private m_Dnw                     As Double
Private m_WandmasseTbt            As Double
Private m_C50                     As Double
Private m_Ctr50                   As Double


'NEW
'________________________________________________________^


'Methoden
'##########################################################################################################################################################################################
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''' Daten auf Vollständigkeit überprüfen                                                         ''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
 Function checkdata_Trennwand() As Boolean
    With frmVBAcousticTrennwand
    
        'lokale Variablen deklarieren
        Dim IsError As Boolean
        IsError = False
    
        'Daten auf Vollständigkeit überprüfen
        If m_Wandtyp = "" Then .cboWandtyp.BackColor = vbRed: IsError = True
        If m_Rw = 0 Then .txtRw_Holz.BackColor = vbRed: IsError = True
        If m_Raumhoehe = 0 Then .txtRaumhoehe_Holz.BackColor = vbRed: IsError = True
        If m_Raumbreite = 0 And m_Raumanordnung <> DIAGONAL Then .txtRaumbreite_Holz.BackColor = vbRed: IsError = True
        
        'Rückgabewert
        If IsError = True Then checkdata_Trennwand = False Else checkdata_Trennwand = True
    
    End With
 End Function



''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
''''''''''''  Berechnung von R'w                                                                          ''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
 Public Sub RStrichw_Trennwand(arrRijw As Variant)
   
    Dim Rijw As Variant

    'Direkte Übertragung
    m_RStrichw = IIf(m_Raumanordnung = DIAGONAL, 0, 10 ^ (-0.1 * m_Rw))
    
    'Flankenübertragungen
    For Each Rijw In arrRijw
      If Rijw > 0 Then m_RStrichw = m_RStrichw + 10 ^ (-0.1 * CDbl(Rijw))
    Next Rijw
    
    m_RStrichw = -10 * Log10(m_RStrichw)

End Sub


'Eigenes Initialize-Event
'++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
Private Sub Class_Initialize()
    
    
End Sub

'Propertys abrufen
'++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
Property Get DRw_SR() As Double
    
    DRw_SR = m_DRw_SR
    
End Property

Property Get DRw_ER() As Double
    
    DRw_ER = m_DRw_ER
    
End Property



Property Get Raumanordnung() As String

    Raumanordnung = m_Raumanordnung

End Property


Property Get Raumhoehe() As Double

    Raumhoehe = m_Raumhoehe

End Property


Property Get Raumbreite() As Double

    Raumbreite = m_Raumbreite

End Property


Property Get Wandtyp() As String

    Wandtyp = m_Wandtyp

End Property

Property Get Anwendungstyp() As String

    Anwendungstyp = m_Anwendungstyp

End Property

Property Get Vorsatzschale() As String

    Vorsatzschale = m_Vorsatzschale

End Property

Property Get Rw() As Double

    Rw = m_Rw

End Property

Property Get RStrichw() As Double

    RStrichw = m_RStrichw

End Property

Property Get Rsw() As Double

    Rsw = m_Rsw

End Property

Property Get Quelle_Tbt() As String

    Quelle_Tbt = m_Quelle_Tbt
End Property

Property Get Flaeche() As Double

    Flaeche = m_Flaeche
    
End Property


Property Get Dnw() As Double

    Dnw = m_Dnw

End Property


Property Get WandmasseTbt() As Double
    
    WandmasseTbt = m_WandmasseTbt
    
End Property

Property Get C50() As Double

    C50 = m_C50

End Property
Property Get Ctr50() As Double

    Ctr50 = m_Ctr50

End Property


'NEW
'________________________________________________________^


'Propertys setzen
'++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

Public Property Let DRw_SR(dblDRw_SR As Double)

    m_DRw_SR = dblDRw_SR
    
End Property

Public Property Let DRw_ER(dblDRw_ER As Double)

    m_DRw_ER = dblDRw_ER
    
End Property


Public Property Let Raumanordnung(strRaumanordnung As String)

    m_Raumanordnung = strRaumanordnung

End Property


Public Property Let Raumhoehe(dblRaumhoehe As Double)

    m_Raumhoehe = dblRaumhoehe

End Property


Public Property Let Raumbreite(dblRaumbreite As Double)

    m_Raumbreite = dblRaumbreite

End Property


Public Property Let Wandtyp(strWandtyp As String)

    m_Wandtyp = strWandtyp

End Property

Public Property Let Anwendungstyp(strAnwendungstyp As String)

    m_Anwendungstyp = strAnwendungstyp

End Property

Public Property Let Vorsatzschale(strVorsatzschale As String)

    m_Vorsatzschale = strVorsatzschale

End Property

Public Property Let Rw(dblRw As Double)

    m_Rw = dblRw

End Property

Public Property Let RStrichw(dblRStrichw As Double)

    m_RStrichw = dblRStrichw

End Property

Public Property Let Rsw(dblRsw As Double)

    m_Rsw = dblRsw

End Property


Public Property Let Quelle_Tbt(strQuelle_Tbt As String)

    m_Quelle_Tbt = strQuelle_Tbt

End Property

Public Property Let Flaeche(dblFlaeche As Double)

    m_Flaeche = dblFlaeche
    
End Property

Public Property Let WandmasseTbt(dblWandmasseTbt As Double)

    m_WandmasseTbt = dblWandmasseTbt
    
End Property
Public Property Let C50(dblC50 As Double)
    
    m_C50 = dblC50

End Property
Public Property Let Ctr50(dblCtr50 As Double)
    
    m_Ctr50 = dblCtr50

End Property

'NEW
'________________________________________________________^

