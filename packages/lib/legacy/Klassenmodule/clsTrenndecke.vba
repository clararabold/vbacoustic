Option Explicit

'**********************************************************************************************************************************************************************************************
'# clsTrenndecke #
'
'**********************************************************************************************************************************************************************************************
'# Beschreibung / Vorgaben fuer die Klasse #
'
'   - Verwaltet alle Daten der Trenndecke
'   - Berechnet dei Luft- und Trittschalldämmung inklusive Flankenübertragung
'
'**********************************************************************************************************************************************************************************************

'Eigenschaften
'##########################################################################################################################################################################################
Private m_Deckentyp             As String
Private m_Estrichtyp            As String
Private m_Beschwerung           As String
Private m_Lnw                   As Double
Private m_CI50                  As Double
Private m_Rw                    As Double
Private m_LStrichnw             As Double
Private m_RStrichw              As Double
Private m_Rsw                   As Double
Private m_Quelle                As String
Private m_mElement              As Double
Private m_DLUnterdecke          As Double
Private m_DRUnterdecke          As Double
Private m_DREstrich             As Double
Private m_Flaeche               As Double

'Methoden
'##########################################################################################################################################################################################
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''' Daten auf Vollständigkeit überprüfen                                                         ''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
 Function checkdata_Trenndecke() As Boolean
    
    'lokale Variablen deklarieren
    Dim IsError As Boolean
    IsError = False

    'Daten auf Vollständigkeit überprüfen
    If m_Deckentyp = "" Then frmVBAcousticTrenndecke.cboTrennbauteil.BackColor = vbRed: IsError = True
    If m_Estrichtyp = "" Then frmVBAcousticTrenndecke.cboEstrichtyp.BackColor = vbRed: IsError = True
    If m_Rw = 0 Then frmVBAcousticTrenndecke.txtRw.BackColor = vbRed: IsError = True
    If m_Lnw = 0 Then frmVBAcousticTrenndecke.txtLnw.BackColor = vbRed: IsError = True
    If (m_Deckentyp = MHD Or m_Deckentyp = MHD_UD Or m_Deckentyp = MHD_HBV Or _
       m_Deckentyp = MHD_RIPPEN_KASTEN) And m_mElement = 0 Then frmVBAcousticTrenndecke.txtMasseDecke.BackColor = vbRed: IsError = True
    If (m_Deckentyp = MHD Or m_Deckentyp = MHD_UD Or m_Deckentyp = MHD_HBV Or _
       m_Deckentyp = MHD_RIPPEN_KASTEN) And m_Rsw = 0 Then frmVBAcousticTrenndecke.txtRsw.BackColor = vbRed: IsError = True
    If m_Flaeche = 0 Then frmVBAcousticTrenndecke.txtL1.BackColor = vbRed: frmVBAcousticTrenndecke.txtL2.BackColor = vbRed: IsError = True
    
    'Daten ergänzen
    m_DREstrich = m_Rw - m_Rsw - m_DRUnterdecke
    
    'Rückgabewert
    If IsError = True Then checkdata_Trenndecke = False Else checkdata_Trenndecke = True
          
 End Function

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''' Berechnung von R'w aus dem Deckenwert und den Flankenschalldämm-Maßen                        ''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
 Public Sub RStrichw_Trenndecke(arrRijw As Variant)
   
    Dim Rijw As Variant
    
    m_RStrichw = 10 ^ (-0.1 * m_Rw)
    
    For Each Rijw In arrRijw
      If Rijw > 0 Then m_RStrichw = m_RStrichw + 10 ^ (-0.1 * CDbl(Rijw))
    Next Rijw
    
    m_RStrichw = -10 * Log10(m_RStrichw)
    
End Sub


''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
'''''''''''' Berechnung von L'nw aus dem Deckenwert und der Flankenübertragung                            ''''''''''''''
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
 Public Sub Lstrichnw_Trenndecke(arrLnijw As Variant)
   
    Dim Lnijw As Variant
    
    m_LStrichnw = 10 ^ (0.1 * m_Lnw)
   
    For Each Lnijw In arrLnijw
      If IsNumeric(Lnijw) Then m_LStrichnw = m_LStrichnw + 10 ^ (0.1 * CDbl(Lnijw))
    Next Lnijw
    
    m_LStrichnw = 10 * Log10(m_LStrichnw)
    
End Sub


'Eigenes Initialize-Event
'++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
Private Sub Class_Initialize()
    
    
End Sub

'Propertys abrufen
'++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
Property Get Deckentyp() As String

    Deckentyp = m_Deckentyp

End Property

Property Get Estrichtyp() As String

    Estrichtyp = m_Estrichtyp

End Property

Property Get Beschwerung() As String

    Beschwerung = m_Beschwerung

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

Property Get Lstrichnw() As Double

    Lstrichnw = m_LStrichnw

End Property

Property Get Lnw() As Double

    Lnw = m_Lnw

End Property

Property Get CI50() As Double

    CI50 = m_CI50

End Property


Property Get Quelle() As String

    Quelle = m_Quelle

End Property

Property Get mElement() As Double

    mElement = m_mElement

End Property

Property Get DRUnterdecke() As Double

    DRUnterdecke = m_DRUnterdecke

End Property
Property Get DLUnterdecke() As Double

    DLUnterdecke = m_DLUnterdecke

End Property


Property Get DREstrich() As Double

    DREstrich = m_DREstrich

End Property

Property Get Flaeche() As Double

    Flaeche = m_Flaeche

End Property


'Propertys setzen
'++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
Public Property Let Deckentyp(strDeckentyp As String)

    m_Deckentyp = strDeckentyp

End Property

Public Property Let Estrichtyp(strEstrichtyp As String)

    m_Estrichtyp = strEstrichtyp

End Property

Public Property Let Beschwerung(strBeschwerung As String)

    m_Beschwerung = strBeschwerung

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

Public Property Let Lstrichnw(dblLStrichnw As Double)
    
    m_LStrichnw = dblLStrichnw

End Property

Public Property Let Lnw(dblLnw As Double)
    
    m_Lnw = dblLnw

End Property

Public Property Let CI50(dblCI50 As Double)
    
    m_CI50 = dblCI50

End Property

Public Property Let mElement(dblmElement As Double)

    m_mElement = dblmElement

End Property

Public Property Let DRUnterdecke(dblDRUnterdecke As Double)

    m_DRUnterdecke = dblDRUnterdecke

End Property

Public Property Let DLUnterdecke(dblDLUnterdecke As Double)

    m_DLUnterdecke = dblDLUnterdecke

End Property

Public Property Let DREstrich(dblDREstrich As Double)

    m_DREstrich = dblDREstrich

End Property

Public Property Let Quelle(strQuelle As String)

    m_Quelle = strQuelle

End Property

Public Property Let Flaeche(dblFlaeche As Double)

    m_Flaeche = dblFlaeche

End Property

