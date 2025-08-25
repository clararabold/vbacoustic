Option Explicit

Private Sub UserForm_Initialize()
    frmDR_VS.Width = frmDR_MHW.Width + 30
    frmDR_VS.Height = frmDR_MHW.Height + 60
    frmDR_VS.Top = Application.Height / 2 - 50
    frmDR_VS.Left = frmVBAcoustic.Left + Application.Width / 2
    
    'Darstellung skalieren
    SetDeviceIndependentWindow Me
    
End Sub

Private Sub cmdBerechnen_Click()
    
    'Variablen deklarieren
    Dim f_0, m1, m2, d, s As Double
    
    'Eingangsdaten über Dialogbox abfragen
    frmf0.Show
    
    'Eingabe überprüfen
    If IsNumeric(frmf0.txtd) And IsNumeric(frmf0.txtmGW) And IsNumeric(frmf0.txtmVS) Then

        'Datenübergabe
        m1 = CDbl(frmf0.txtmGW)
        m2 = CDbl(frmf0.txtmVS)
        d = CDbl(frmf0.txtd)
    
        'f0 berechnen
        If d > 0 And m1 > 0 And m2 > 0 Then
            f_0 = 160 * Sqr(0.08 / d * (1 / m1 + 1 / m2))
        ElseIf s > 0 And m1 > 0 And m2 > 0 Then
            f_0 = 160 * Sqr(s * (1 / m1 + 1 / m2))
        Else
            f_0 = 0
        End If
        
    Else
        f_0 = 0
        
    End If
    
    frmDR_VS.txtf0 = Round(f_0, 0)
    
End Sub

Private Sub cmdCancel_Click()
    frmDR_VS.Hide
    bCancel = True
End Sub

Private Sub cmdOK_Click()
    frmDR_VS.Hide
    bCancel = False
End Sub
