Option Explicit

Sub UserForm_Initialize()

       
    With frmBaumessung
    
        .Top = 200
        .Left = Application.Left + 300
        If frmVBAcoustic.optDecke = True Then
            .txtTrennbauteil = "ZE_MWsd8_HBD_DSA_GKF_GKF"
            .frmMessergebnisse_Trenndecke.Visible = True
            .frmMessergebnisse_Trennwand.Visible = False
            .frmOKCancel.Top = .frmMessergebnisse_Trenndecke.Top + .frmMessergebnisse_Trenndecke.Height + 10
            frmBaumessung.Height = .frmOKCancel.Top + .frmOKCancel.Height + 40
            
        ElseIf frmVBAcoustic.optWand = True Then
            .txtTrennbauteil = "B_bGF10_bGF12_frT60||iMW40_bGF12_bGF10"
            .frmMessergebnisse_Trenndecke.Visible = False
            .frmMessergebnisse_Trennwand.Visible = True
            .frmMessergebnisse_Trennwand.Top = .frmMessergebnisse_Trenndecke.Top
            .frmOKCancel.Top = .frmMessergebnisse_Trennwand.Top + .frmMessergebnisse_Trennwand.Height + 10
            frmBaumessung.Height = .frmOKCancel.Top + .frmOKCancel.Height + 40
            
        End If
        
    End With

End Sub


Private Sub cmdCancel_Click()
    Application.Workbooks(VBAcoustic).Activate
    frmBaumessung.Hide
    frmBaumessung.Tag = "Cancel"
End Sub

Private Sub cmdOK_Click()
    Application.Workbooks(VBAcoustic).Activate
    frmBaumessung.Hide
    frmBaumessung.Tag = "OK"
End Sub
