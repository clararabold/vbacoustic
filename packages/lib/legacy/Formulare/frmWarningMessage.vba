
Option Explicit


Private Sub UserForm_Initialize()
    frmWarningMessage.Width = 330
    frmWarningMessage.ImWarndreieck.Left = 75
    frmWarningMessage.Top = Application.Height / 2 - 50
    frmWarningMessage.Left = frmVBAcoustic.Left + Application.Width / 2 - 110
    
    'Darstellung skalieren
    SetDeviceIndependentWindow Me
    
End Sub

Private Sub CommandButton1_Click()
    frmWarningMessage.Hide
    frmWarningMessage.ImWarndreieck.Visible = False
    frmWarningMessage.ImUnderConstruction.Visible = True
End Sub


Public Sub WarningMessage(strText As String, strTyp As String)
    frmWarningMessage.Caption = strText
    frmWarningMessage.ImUnderConstruction.Visible = IIf(strTyp = "UnderConstruction", True, False)
    frmWarningMessage.ImWarndreieck.Visible = IIf(strTyp = "Warning", True, False)
    frmWarningMessage.Show
End Sub
