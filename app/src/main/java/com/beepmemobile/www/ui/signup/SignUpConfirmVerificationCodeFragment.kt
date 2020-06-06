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
import com.beepmemobile.www.databinding.SignUpConfirmVerificationCodeFragmentBinding
import com.beepmemobile.www.data.*;
import com.beepmemobile.www.data.*;
import com.beepmemobile.www.ui.main.MainViewModel

class SignUpConfirmVerificationCodeFragment : Fragment() {
    private val model: SignUpConfirmVerificationCodeViewModel by viewModels()
    private val authModel: MainViewModel by activityViewModels()
    private val navController by lazy { findNavController() }
    private var _binding: SignUpConfirmVerificationCodeFragmentBinding? = null
    // This property is only valid between onCreateView and
    // onDestroyView.

    private val binding get() = _binding!!

    companion object {
        fun newInstance() = SignUpConfirmVerificationCodeFragment()
    }


    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        _binding = SignUpConfirmVerificationCodeFragmentBinding.inflate(inflater, container, false)
        val view = binding.root
        return view
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {

        (this.activity as MainActivity).supportActionBar?.hide();

        binding.signUpConfirmVerificationCodeBtnNext.setOnClickListener {

            var confirm_verification_code = binding.signUpConfirmVerificationCodeTxtCode.text.toString()

            var req = mapOf<String, String>("confirm_verification_code" to confirm_verification_code)

            authModel.singupStage(req, AuthState.AUTH_STAGE_CONFIRM_VERIFICATION_CODE)
        }

        binding.signUpConfirmVerificationCodeBtnBack.setOnClickListener {
            //TODO go back
        }
		
		val observer = Observer<AppUser> { app_user ->
		
			if(app_user.auth_state == AuthState.AUTH_STAGE_SUCCESS){

                view.visibility = View.VISIBLE //come back
                val direction =
                            SignUpConfirmVerificationCodeFragmentDirections.moveToHomeFragment()

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
