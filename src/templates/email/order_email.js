export const mail = (order) =>{
    return `<table bgcolor="#ffffff" class="m_-5141058115782440794mob-width-white" width="650" border="0" cellpadding="0" cellspacing="0" align="center" valign="top" style="border-spacing:0!important;border-collapse:collapse!important;table-layout:auto!important;text-transform:none!important;margin:0 auto">
                            

                            
    <tbody><tr>
      <td height="400" valign="top">
        <table bgcolor="#ffffff" class="m_-5141058115782440794mob-width-white" width="650" border="0" cellpadding="0" cellspacing="0" align="center" valign="top" style="border-top-left-radius:10px;border-top-right-radius:10px;border-spacing:0!important;border-collapse:collapse!important;table-layout:auto!important;text-transform:none!important;margin:0 auto">

          
          <tbody><tr>
            <td class="m_-5141058115782440794colAppL" height="170" valign="top" style="padding-top:20px;max-width:325px">
              <table class="m_-5141058115782440794colAppL" width="325" align="center" border="0" cellpadding="0" cellspacing="0" style="max-width:325px;border-spacing:0!important;border-collapse:collapse!important;table-layout:auto!important;text-transform:none!important;margin:0 auto">
                
                <tbody><tr>
                  <td>
                    <table class="m_-5141058115782440794colAppL" width="100%" align="left" border="0" cellpadding="0" cellspacing="0" style="border-spacing:0!important;border-collapse:collapse!important;table-layout:auto!important;text-transform:none!important;margin:0 auto">
                      <tbody><tr>
                        <td class="m_-5141058115782440794mob-p-10-text" style="font-family:'Roboto',Arial;font-size:16px;line-height:34px;color:#1f4d5d;font-weight:500;padding:30px 0 0 25px">
                          Summary:
                        </td>
                      </tr>
                      <tr>
                        <td class="m_-5141058115782440794mob-p-10-text" style="font-family:'Roboto',Arial;font-size:16px;line-height:28px;font-weight:300;padding:0 0 10px 25px">
                          <span> Order number:  ${order.order_number} </span><br>
                            <span> Order time:  ${order.order_datetime}</span><br>
                            </td>
                          </tr>
                        </tbody></table>
                      </td>
                    </tr>
                    
                  </tbody></table>
                </td>
                <td class="m_-5141058115782440794colAppL" height="170" valign="top" style="padding-top:20px;max-width:325px">
                  <table class="m_-5141058115782440794mob-border m_-5141058115782440794colAppL" width="325" align="left" border="0" cellpadding="0" cellspacing="0" style="border-left-width:2px;border-left-color:#bebebe;border-left-style:solid;max-width:325px;border-spacing:0!important;border-collapse:collapse!important;table-layout:auto!important;text-transform:none!important;margin:0 auto">
                    
                    <tbody><tr>
                      <td>
                        <table class="m_-5141058115782440794colAppL" width="100%" align="left" border="0" cellpadding="0" cellspacing="0" style="border-spacing:0!important;border-collapse:collapse!important;table-layout:auto!important;text-transform:none!important;margin:0 auto">
                          <tbody><tr>
                            <td class="m_-5141058115782440794mob-p-10-text" style="font-family:'Roboto',Arial;font-size:16px;line-height:34px;color:#1f4d5d;font-weight:500;padding:30px 0 0 25px">
                              
                              Delivery address:
                            
                            
                          
                      </td>
                    </tr>
                    <tr>
                      <td class="m_-5141058115782440794mob-p-10-text" style="font-family:'Roboto',Arial;font-size:16px;line-height:28px;font-weight:300;padding:0 0 10px 25px">
                        
                        <span>
                          ${order.customer.first_name} ${order.customer.last_name}
                          </span><br>
                          <span>
                            
                            </span><br>
                            <span>   ${order.customer_address.address} 
                            </span><br><br>
                              <span>
                                
                                </span>
                              

                              

                                    
                                        </td>
                                      </tr>
                                    </tbody></table>
                                  </td>
                                </tr>
                                
                              </tbody></table>
                            </td>
                          </tr>
                          

                          
                          <tr>
                            <td colspan="2" valign="top" height="30">
                              <table bgcolor="ffffff" class="m_-5141058115782440794wrapper" align="center" width="600" height="0" style="border-top-width:2px;border-top-color:#bebebe;border-top-style:dotted;color:#bebebe;border-spacing:0!important;border-collapse:collapse!important;table-layout:auto!important;text-transform:none!important;margin:0 auto">
                                <tbody><tr>
                                  <td>
                                  </td>
                                </tr>
                              </tbody></table>
                            </td>
                          </tr>
                          

                          
                          <tr>
                            <td colspan="2" valign="top" height="300">
                              <table class="m_-5141058115782440794wrapper" width="600" align="center" valign="top" border="0" cellpadding="0" cellspacing="0" style="border-spacing:0!important;border-collapse:collapse!important;table-layout:auto!important;text-transform:none!important;margin:0 auto">
                                <tbody><tr>
                                  <td class="m_-5141058115782440794mob-padding-10" style="font-family:'Roboto',Arial;color:#1f4d5d;font-size:16px;line-height:18px;font-weight:600;padding:0 0 22px">
                                    
                                    <span>
                                      Hey ${order.customer.first_name} ${order.customer.last_name},
                                      </span>
                                      
                                    </td>
                                  </tr>
                                  <tr>
                                    <td class="m_-5141058115782440794mob-p-10-text" style="font-family:'Roboto',Arial;font-size:16px;line-height:25px;font-weight:300">
                                      <span>
                                        
                                        Well chosen. Your order from <b style="font-weight:bold;color:#4cb32b">${order.branch.name}</b> is on its way.
                                        
                                        
                                        
                                      </span>
                                    </td>
                                  </tr>
                                  

                                  
                                  <tr>
                                    <td colspan="2" valign="middle" height="20">
                                      <table class="m_-5141058115782440794wrapper" bgcolor="ffffff" align="center" width="600" height="0" style="color:#bebebe;border-spacing:0!important;border-collapse:collapse!important;table-layout:auto!important;text-transform:none!important;margin:0 auto">
                                        <tbody><tr>
                                          <td>
                                          </td>
                                        </tr>
                                      </tbody></table>
                                    </td>
                                  </tr>
                                  

                                  <tr>
                                    <td class="m_-5141058115782440794mob-p-10-text" style="font-family:'Roboto',Arial;font-size:16px;line-height:25px;font-weight:300">
                                      <span>
                                        If there's anything else you need, please head over to the <a href="https://ablink.mail.foodhub.com.bd/ls/click?upn=12-2BjRkpfoncUR7Zm1WXg5k1rh3HUQW170-2FXUPLQ6hrG01Jfi9cKLpNR4DPLBchoF7KC4ZLl-2BpfQi-2FvvR8moFqdUMUh-2FfQU7PKV-2B7m2AvNy3VfaPwBt3RXlGyt-2By2cGYkxTedXIu9EI7-2BIxbuI6qfWudrCM0n7PnHrW8EdXA8RDxyTYt4dOB18Uz0ZDOTooshJcBAxYtPhXTt4DHoh9uD12e-2F6Hrko8eL2-2FmCEbs-2Fr0tbzZEYJ4kugy0cxnl2TSN4yJeb7RgC4Z1U-2ByHduwYhCbPX7q0iUsENfZbsKWSK1Rl5P61GaK-2BRG-2B6P2eKaW9x8mtfXLTl7gP889lLTUXowPSzCYn9CLmcPRqtpgqlfV7yvRKvbm8o-2FCCmxaBUJRd9DVxPWzt-2F2w9X8YnRDcsH5dLa8bzneb9mwWZO-2BHeTWv4gGce5RJ2MUuXA-2FTd3PZrp7hinEHuc3WEvpN-2FhsrhyCJiN7WKCIwuxV1Ji7Oj3YTXU0xQ0T33gjPnydHxsXiUPe-2BkWI9LcIJuKI7L5j0LpP3M3zOFTMSoBbX3EZT8O53L-2FMshMID1J3SiXsnJ6D3VWShtfunsiMzvlJ4L3xhXUJzgfIVKPZtugIHCFwtvS2uiYS479Jo7nl9nQOBOqUcdSOvE0vLx3zLJPigzsJA5vjsvbMDgJ-2FYt49WySCZGi000-2B-2F1bsa7u-2Fog1TWFyzweFlv18zX7wqI8zTNId-2FnSeTy4yptGSKT-2FDjkFnvzVygVHqeq9Ir-2FFtipWZblSKy7EGOSusLEpPBrwqSiTTdpgPb9gJkZZ2s-2F0oNu-2FcLhqZCyuwfK6MGU5LOHkOQEMxxMOIU0ZmWZ_H-2B22kmRE2N-2FgFlbFNqxHtHYsi5GPsVOhLYOssHrHZNMSk1jqE3Rvkl895kU8HQU0lY2Q-2F-2Bp-2F0V40nbwC0owkBWTFk2pY2blkAEZyD6xKtd7xRlCShWzyriI29cxexi7RP95rISt7aAEEmTkp736omctzXXC28tGkq6p8pSCA-2FcD0eWrEbXttifbQz2SMRVIAnXetuFI1xkM8xKEw0XVnovR7I-2FPAqqNVB7FMOGDVR5XZ-2FDtuNY3rdscNnqjFv0Yzy-2FqG-2B4omZCMba153HjQzc8-2BHLgLu6qEIvv-2FWFlWLsjJwaRCK7a3doWLB80BA1nvdjPfFJk70rKztSMEoyzPHR7tPE-2Fmwh8uDvj7u5IN1Kh-2BOKl9R5cTLz-2FyiaDdN0eMgnBoNb0taU3vjpo0kAgoRt3Bi4guIU-2FKbyK7jcRv0N-2B798k8BTlwouz2kCO2FmTPWk-2BsueGFzVNUcg6p-2FpNibBgVqWcwJBFMD5DDlOcvyLWtv1CoIUczbZ3b-2BRZT196-2BVYncuro67MU2kXUe3K1LeIDmlM-2BJRy5Ho2gB2eebIA-2FvfpKJGBYSodmJbVmK9R-2BkzU8TEX9nui-2BITEop2ZAVd7ESqSU2FIxiNeWqUNCLaZT2cwir-2FTQLs9ZqTDycOutCVA-2F5TIPY-2BE6zreEY3VdH85Q-3D-3D" style="color:#4cb32b;text-decoration:none;font-weight:bold;font-size:inherit;font-family:inherit;line-height:inherit" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://ablink.mail.foodhub.com.bd/ls/click?upn%3D12-2BjRkpfoncUR7Zm1WXg5k1rh3HUQW170-2FXUPLQ6hrG01Jfi9cKLpNR4DPLBchoF7KC4ZLl-2BpfQi-2FvvR8moFqdUMUh-2FfQU7PKV-2B7m2AvNy3VfaPwBt3RXlGyt-2By2cGYkxTedXIu9EI7-2BIxbuI6qfWudrCM0n7PnHrW8EdXA8RDxyTYt4dOB18Uz0ZDOTooshJcBAxYtPhXTt4DHoh9uD12e-2F6Hrko8eL2-2FmCEbs-2Fr0tbzZEYJ4kugy0cxnl2TSN4yJeb7RgC4Z1U-2ByHduwYhCbPX7q0iUsENfZbsKWSK1Rl5P61GaK-2BRG-2B6P2eKaW9x8mtfXLTl7gP889lLTUXowPSzCYn9CLmcPRqtpgqlfV7yvRKvbm8o-2FCCmxaBUJRd9DVxPWzt-2F2w9X8YnRDcsH5dLa8bzneb9mwWZO-2BHeTWv4gGce5RJ2MUuXA-2FTd3PZrp7hinEHuc3WEvpN-2FhsrhyCJiN7WKCIwuxV1Ji7Oj3YTXU0xQ0T33gjPnydHxsXiUPe-2BkWI9LcIJuKI7L5j0LpP3M3zOFTMSoBbX3EZT8O53L-2FMshMID1J3SiXsnJ6D3VWShtfunsiMzvlJ4L3xhXUJzgfIVKPZtugIHCFwtvS2uiYS479Jo7nl9nQOBOqUcdSOvE0vLx3zLJPigzsJA5vjsvbMDgJ-2FYt49WySCZGi000-2B-2F1bsa7u-2Fog1TWFyzweFlv18zX7wqI8zTNId-2FnSeTy4yptGSKT-2FDjkFnvzVygVHqeq9Ir-2FFtipWZblSKy7EGOSusLEpPBrwqSiTTdpgPb9gJkZZ2s-2F0oNu-2FcLhqZCyuwfK6MGU5LOHkOQEMxxMOIU0ZmWZ_H-2B22kmRE2N-2FgFlbFNqxHtHYsi5GPsVOhLYOssHrHZNMSk1jqE3Rvkl895kU8HQU0lY2Q-2F-2Bp-2F0V40nbwC0owkBWTFk2pY2blkAEZyD6xKtd7xRlCShWzyriI29cxexi7RP95rISt7aAEEmTkp736omctzXXC28tGkq6p8pSCA-2FcD0eWrEbXttifbQz2SMRVIAnXetuFI1xkM8xKEw0XVnovR7I-2FPAqqNVB7FMOGDVR5XZ-2FDtuNY3rdscNnqjFv0Yzy-2FqG-2B4omZCMba153HjQzc8-2BHLgLu6qEIvv-2FWFlWLsjJwaRCK7a3doWLB80BA1nvdjPfFJk70rKztSMEoyzPHR7tPE-2Fmwh8uDvj7u5IN1Kh-2BOKl9R5cTLz-2FyiaDdN0eMgnBoNb0taU3vjpo0kAgoRt3Bi4guIU-2FKbyK7jcRv0N-2B798k8BTlwouz2kCO2FmTPWk-2BsueGFzVNUcg6p-2FpNibBgVqWcwJBFMD5DDlOcvyLWtv1CoIUczbZ3b-2BRZT196-2BVYncuro67MU2kXUe3K1LeIDmlM-2BJRy5Ho2gB2eebIA-2FvfpKJGBYSodmJbVmK9R-2BkzU8TEX9nui-2BITEop2ZAVd7ESqSU2FIxiNeWqUNCLaZT2cwir-2FTQLs9ZqTDycOutCVA-2F5TIPY-2BE6zreEY3VdH85Q-3D-3D&amp;source=gmail&amp;ust=1656484304027000&amp;usg=AOvVaw3DxQY3kX7AFmSh3LitDycb">Help Center</a> for assistance.
                                      </span>
                                    </td>
                                  </tr>
                                  

                                  
                                  <tr>
                                    <td colspan="2" style="padding:33px 0">
                                    
                                    </td>
                                  </tr>
                                  

                                  
                                  <tr>
                                    <td class="m_-5141058115782440794mob-p-10-text" style="font-family:'Roboto',Arial;font-size:16px;line-height:25px;font-weight:300">

                                      <span>
                                        Until next time,
                                        <br>
                                        <b style="color:#4cb32b"> Your foodhub team </b>
                                      </span>
                                    </td>
                                  </tr>
                                </tbody></table>
                              </td>
                            </tr>
                            

                            
                            <tr>
                              <td colspan="2" valign="middle" height="40" style="max-width:600px">
                                <table bgcolor="ffffff" class="m_-5141058115782440794mob-hide" align="center" width="600" height="0" style="border-top-width:2px;border-top-color:#bebebe;border-top-style:dotted;color:#bebebe;max-width:600px;border-spacing:0!important;border-collapse:collapse!important;table-layout:auto!important;text-transform:none!important;margin:0 auto">
                                  <tbody><tr>
                                    <td>
                                    </td>
                                  </tr>
                                </tbody></table>
                              </td>
                            </tr>
                            

                            
                            <tr>
                              <td colspan="2">
                                <table class="m_-5141058115782440794wrapper" align="center" width="600" valign="top" border="0" cellpadding="0" cellspacing="0" style="border-spacing:0!important;border-collapse:collapse!important;table-layout:auto!important;text-transform:none!important;margin:0 auto">
                                  

                                  
                                  <tbody><tr>
                                    <td class="m_-5141058115782440794mob-padding-10">
                                      <table bgcolor="#d0dde3" class="m_-5141058115782440794wrapper" width="100%" height="55" align="center" border="0" cellpadding="0" cellspacing="0" style="border-radius:10px;border-spacing:0!important;border-collapse:collapse!important;table-layout:auto!important;text-transform:none!important;margin:0 auto">
                                        <tbody><tr>
                                          <td class="m_-5141058115782440794mob-padding-10 m_-5141058115782440794mob-f-16 m_-5141058115782440794mob-width-item" width="100%" height="55" style="font-family:'Roboto',Arial;font-size:24px;line-height:20px;font-weight:600;color:#8aa7b3;padding-left:10px;max-width:500px">
                                          Qty | Item
                                          </td>

                                          <td class="m_-5141058115782440794mob-padding-10 m_-5141058115782440794mob-f-16 m_-5141058115782440794mob-width-price" width="100%" height="55" style="font-family:'Roboto',Arial;font-size:24px;line-height:20px;font-weight:600;color:#8aa7b3;max-width:80px;padding-right:10px" align="center">
                                          Price
                                          </td>
                                        </tr>
                                      </tbody></table>
                                    </td>
                                  </tr>
                                  

                                  
                                  <tr>
                                    <td class="m_-5141058115782440794mob-padding-10" style="font-family:'Roboto',Arial;font-size:14px;line-height:20px;font-weight:300;color:#000">
                                      <table class="m_-5141058115782440794wrapper" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" style="max-width:600px;border-spacing:0!important;border-collapse:collapse!important;table-layout:auto!important;text-transform:none!important;margin:0 auto">
                                        <tbody>
                                        ${
                                        order?.order_items?.map((pd) => (
                                            `<tr key="${pd.id}">
                                                <td colspan="3" style="font-size:14px;padding:14px 5px 14px 14px">
                                                    <table width="100%" bgcolor="" cellpadding="0" cellspacing="0" border="0" style="line-height:20px;text-transform:none!important;border-spacing:0!important;border-collapse:collapse!important;table-layout:auto!important;margin:0 auto">
                                                        <tbody>
                                                            <tr>
                                                                <td width="30"><strong style="font-weight:300!important;font-size:14px!important">${pd?.quantity} X</strong></td>
                                                                <td><strong style="font-weight:300!important;font-size:14px!important">${pd?.item?.name}</strong></td>
                                                                <td width="60" align="right"><strong style="font-weight:300!important;font-size:14px!important">Tk&nbsp;${pd?.price}</strong></td>
                                                            </tr>
    
                                                            <tr>
                                                                <td>&nbsp;</td>
                                                                <td> 
                                                                    ${pd?.item_variant ? pd?.item_variant?.name : ''}
                                                                    <span style="font-size:12px">
                                                                        <br>
                                                                        ${pd.item_extra.map(ext =>
                                                                            `<br  key="${ext.id}">${ext.name}`
                                                                        )}
                                                                    </span>
                                                                </td>
                                                                <td>&nbsp;</td>
                                                                </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>`
                                            
                                            ))
                                        }
                                    </tbody>
                                </table>
                                    </td>
                                  </tr>
                                  

                                  
                                  <tr>
                                    <td class="m_-5141058115782440794mob-padding-10" colspan="2" valign="middle" height="40">
                                      <table bgcolor="ffffff" class="m_-5141058115782440794wrapper" align="center" width="100%" height="0" style="border-top-width:1px;border-top-color:#bebebe;border-top-style:solid;color:#bebebe;max-width:600px;border-spacing:0!important;border-collapse:collapse!important;table-layout:auto!important;text-transform:none!important;margin:0 auto">
                                        <tbody><tr>
                                          <td>
                                          </td>
                                        </tr>
                                      </tbody></table>
                                    </td>
                                  </tr>
                                  

                                  
                                  <tr>
                                    <td style="line-height:35px;padding:0 0 22px">
                                      <table width="100%" class="m_-5141058115782440794wrapper" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;border-spacing:0!important;border-collapse:collapse!important;table-layout:auto!important;text-transform:none!important;margin:0 auto">
                                        
                                        

                                        
                                        
                                        <tbody><tr>
                                          <td width="300" class="m_-5141058115782440794mob-hide">
                                            <table width="300" cellpadding="0" cellspacing="0" border="0" style="border-spacing:0!important;border-collapse:collapse!important;table-layout:auto!important;text-transform:none!important;margin:0 auto">
                                              <tbody><tr>
                                                <td>
                                                </td>
                                              </tr>
                                            </tbody></table>
                                          </td>
                                          <td width="300" class="m_-5141058115782440794mob-padding-10">
                                            <table width="300" class="m_-5141058115782440794wrapper" cellpadding="0" cellspacing="0" border="0" style="border-spacing:0!important;border-collapse:collapse!important;table-layout:auto!important;text-transform:none!important;margin:0 auto">
                                              <tbody><tr>
                                                <td class="m_-5141058115782440794mob-font-12" style="font-family:'Roboto',Arial,sans-serif;font-weight:300;font-size:14px;line-height:40px">
                                                  Subtotal
                                                </td>
                                                <td class="m_-5141058115782440794mob-font-12" align="right" style="font-family:'Roboto',Arial,sans-serif;font-weight:300;font-size:14px;line-height:40px">
                                                Tk${order.sub_total}
                                                </td>
                                              </tr>
                                            </tbody></table>
                                          </td>
                                        </tr>
                                        

                                        
                                        <tr>
                                          <td width="300" class="m_-5141058115782440794mob-hide">
                                            <table width="300" cellpadding="0" cellspacing="0" border="0" style="border-spacing:0!important;border-collapse:collapse!important;table-layout:auto!important;text-transform:none!important;margin:0 auto">
                                              <tbody><tr>
                                                <td>
                                                </td>
                                              </tr>
                                            </tbody></table>
                                          </td>
                                          <td width="300" class="m_-5141058115782440794mob-padding-10">
                                            <table width="300" class="m_-5141058115782440794wrapper" cellpadding="0" cellspacing="0" border="0" style="border-spacing:0!important;border-collapse:collapse!important;table-layout:auto!important;text-transform:none!important;margin:0 auto">
                                              <tbody><tr>
                                                <td class="m_-5141058115782440794mob-font-12" style="font-family:'Roboto',Arial,sans-serif;font-weight:300;font-size:14px;line-height:40px">
                                                  Difference to minimum
                                                </td>
                                                <td class="m_-5141058115782440794mob-font-12" align="right" style="font-family:'Roboto',Arial,sans-serif;font-weight:300;font-size:14px;line-height:40px">
                                                  Tk0
                                                </td>
                                              </tr>
                                            </tbody></table>
                                          </td>
                                        </tr>
                                        

                                        
                                        <tr>
                                          <td width="300" class="m_-5141058115782440794mob-hide">
                                            <table width="300" cellpadding="0" cellspacing="0" border="0" style="border-spacing:0!important;border-collapse:collapse!important;table-layout:auto!important;text-transform:none!important;margin:0 auto">
                                              <tbody><tr>
                                                <td>
                                                </td>
                                              </tr>
                                            </tbody></table>
                                          </td>
                                          <td width="300" class="m_-5141058115782440794mob-padding-10">
                                            <table width="300" class="m_-5141058115782440794wrapper" cellpadding="0" cellspacing="0" border="0" style="border-spacing:0!important;border-collapse:collapse!important;table-layout:auto!important;text-transform:none!important;margin:0 auto">
                                              <tbody><tr>
                                                <td class="m_-5141058115782440794mob-font-12" style="font-family:'Roboto',Arial,sans-serif;font-weight:300;font-size:14px;line-height:40px">
                                                  Incl. delivery fee
                                                </td>
                                                <td class="m_-5141058115782440794mob-font-12" align="right" style="font-family:'Roboto',Arial,sans-serif;font-weight:300;font-size:14px;line-height:40px">
                                                  Tk${order.delivery_amount > 0 ? order.delivery_amount : 0}
                                                </td>
                                              </tr>
                                            </tbody></table>
                                          </td>
                                        </tr>
                                        
                                        <tr>
                                          <td width="300" class="m_-5141058115782440794mob-hide">
                                            <table width="300" cellpadding="0" cellspacing="0" border="0" style="border-spacing:0!important;border-collapse:collapse!important;table-layout:auto!important;text-transform:none!important;margin:0 auto">
                                              <tbody><tr>
                                                <td>
                                                </td>
                                              </tr>
                                            </tbody></table>
                                          </td>
                                          <td width="300" class="m_-5141058115782440794mob-padding-10">
                                            <table width="300" class="m_-5141058115782440794wrapper" cellpadding="0" cellspacing="0" border="0" style="border-spacing:0!important;border-collapse:collapse!important;table-layout:auto!important;text-transform:none!important;margin:0 auto">
                                              <tbody><tr>
                                                <td class="m_-5141058115782440794mob-font-12" style="font-family:'Roboto',Arial,sans-serif;font-weight:300;font-size:14px;line-height:40px">
                                                  Discount
                                                </td>
                                                <td class="m_-5141058115782440794mob-font-12" align="right" style="font-family:'Roboto',Arial,sans-serif;font-weight:300;font-size:14px;line-height:40px">
                                                - Tk&nbsp;${order.discount_amount ? order.discount_amount : 0}
                                                    
                                                    
                                                </td>
                                              </tr>
                                            </tbody></table>
                                          </td>
                                        </tr>
                                        <tr>
                                          <td width="300" class="m_-5141058115782440794mob-hide">
                                            <table width="300" cellpadding="0" cellspacing="0" border="0" style="border-spacing:0!important;border-collapse:collapse!important;table-layout:auto!important;text-transform:none!important;margin:0 auto">
                                              <tbody><tr>
                                                <td>
                                                </td>
                                              </tr>
                                            </tbody></table>
                                          </td>
                                          <td width="300" class="m_-5141058115782440794mob-padding-10">
                                            <table width="300" class="m_-5141058115782440794wrapper" cellpadding="0" cellspacing="0" border="0" style="border-spacing:0!important;border-collapse:collapse!important;table-layout:auto!important;text-transform:none!important;margin:0 auto">
                                              <tbody><tr>
                                                <td class="m_-5141058115782440794mob-font-12" style="font-family:'Roboto',Arial,sans-serif;font-weight:300;font-size:14px;line-height:40px">
                                                  Voucher
                                                </td>
                                                <td class="m_-5141058115782440794mob-font-12" align="right" style="font-family:'Roboto',Arial,sans-serif;font-weight:300;font-size:14px;line-height:40px">
                                                - Tk&nbsp;${order.voucher_amount ? order.voucher_amount : 0}
                                                    
                                                    
                                                </td>
                                              </tr>
                                            </tbody></table>
                                          </td>
                                        </tr>
                                        
                                        
                                        

                                        
                                        
                                        <tr>
                                          <td width="300" class="m_-5141058115782440794mob-hide">
                                            <table width="300" cellpadding="0" cellspacing="0" border="0" style="border-spacing:0!important;border-collapse:collapse!important;table-layout:auto!important;text-transform:none!important;margin:0 auto">
                                              <tbody><tr>
                                                <td>
                                                </td>
                                              </tr>
                                            </tbody></table>
                                          </td>
                                          <td width="300" class="m_-5141058115782440794mob-padding-10">
                                            <table width="300" class="m_-5141058115782440794wrapper" cellpadding="0" cellspacing="0" border="0" style="border-spacing:0!important;border-collapse:collapse!important;table-layout:auto!important;text-transform:none!important;margin:0 auto">
                                              <tbody><tr>
                                                <td class="m_-5141058115782440794mob-font-12" style="font-family:'Roboto',Arial,sans-serif;font-weight:600;font-size:14px;line-height:40px">
                                                  Order Total
                                                </td>
                                                <td class="m_-5141058115782440794mob-font-12" align="right" style="font-family:'Roboto',Arial,sans-serif;font-weight:600;font-size:14px;color:#4cb32b;line-height:40px">
                                                Tk${order?.grand_total}
                                                </td>
                                              </tr>
                                            </tbody></table>
                                          </td>
                                        </tr>
                                        

                                        
                                      </tbody></table>
                                    </td>
                                  </tr>
                                  

                                  
                                </tbody></table>
                              </td>
                            </tr>
                            

                            
                          </tbody></table>
                        </td>
                      </tr>
                      

                    </tbody></table>`
}