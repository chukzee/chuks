package com.beepmemobile.www.ui.signup

import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.drawerlayout.widget.DrawerLayout
import androidx.fragment.app.activityViewModels
import androidx.fragment.app.viewModels
import androidx.lifecycle.Observer
import androidx.navigation.fragment.findNavController
import com.beepmemobile.www.MainActivity

import com.beepmemobile.www.R
import com.beepmemobile.www.databinding.SignUpPhoneNumberVerificationFragmentBinding
import com.beepmemobile.www.data.*;
import com.beepmemobile.www.ui.main.MainViewModel

class SignUpPhoneNumberVerificationFragment : Fragment() {
    private val model: SignUpPhoneNumberVerificationViewModel by viewModels()
    private val authModel: MainViewModel by activityViewModels()
    private val navController by lazy { findNavController() }

    private var _binding: SignUpPhoneNumberVerificationFragmentBinding? = null
    // This property is only valid between onCreateView and
    // onDestroyView.

    private val binding get() = _binding!!

    companion object {
        fun newInstance() = SignUpPhoneNumberVerificationFragment()
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        _binding = SignUpPhoneNumberVerificationFragmentBinding.inflate(inflater, container, false)
        val view = binding.root
        return view
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {

        binding.signUpPhoneNumberVerificationBtnNext.setOnClickListener {

            var phone_no = binding.signUpPhoneNumberVerificationTxtPhoneNo.text.toString()
            var zip_code = binding.signUpPhoneNumberVerificationLblZipCode.text.toString()
            var selected_item = binding.signUpPhoneNumberVerificationSpnCountry.selectedItem
            var country = selected_item?.toString()?: ""

            var req = mapOf<String, String>("phone_no" to phone_no, "zip_code" to zip_code, "country" to country)

            authModel.singupStage(req, AuthState.AUTH_STAGE_PHONE_NUMBER_VERIFY)
        }

        binding.signUpPhoneNumberVerificationBtnBack.setOnClickListener {
            //TODO go back
        }
		
		val observer = Observer<AppUser> { app_user ->
		
			if(app_user.auth_state == AuthState.AUTH_STAGE_CONFIRM_VERIFICATION_CODE){

                val direction =
                            SignUpPhoneNumberVerificationFragmentDirections.moveToSignUpConfirmVerificationCodeFragment()

				navController.navigate(direction)
            }
		
		}
		
		// Observe the LiveData, passing in this fragment LifecycleOwner and the observer.
        authModel.auth.observe(viewLifecycleOwner, observer)

        super.onViewCreated(view, savedInstanceState)
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }

    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)

    }

}
